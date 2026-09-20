import type { DataTableColumn, DataTableRowData } from 'naive-ui';
import type { CommitMap, ModUnitInfo } from '@/library-collection';
import { h } from 'vue';
import ViewerTooltip from '@/components/ViewerTooltip.vue';

type ComponentKey = typeof componentKeys[number];

const componentKeys = ['ib', 'position_vb', 'blend_vb', 'draw_vb', 'texcoord_vb', 'root_vs', 'first_vs'] as const;
const firstColumnKey = 'argument';

export type DiffStatus = 'added' | 'changed' | 'removed';

/** 挂在行数据上的隐藏字段，记录各版本的差异状态，供渲染层读取。 */
export const diffKey = '__diff';

function annotateRows(rows: DataTableRowData[], revisions: ModUnitInfo['revisions']) {
    for (const row of rows) {
        const diff: Record<string, DiffStatus> = {};
        let previous: unknown;
        let state: 'init' | 'value' | 'missing' = 'init';
        // revisions 为时间倒序（索引越小越新），逆序遍历得到时间正序
        for (let i = revisions.length - 1; i >= 0; --i) {
            const { hash, content } = revisions[i];
            if (content === null) {
                // 整个版本的数据缺失，跳过且不打断比较链
                continue;
            }
            const value = row[hash];
            if (value === undefined) {
                // 只在从有值转为缺失的那一版标记，避免后续空版本被连续高亮
                if (state === 'value') {
                    diff[hash] = 'removed';
                }
                state = 'missing';
            }
            else {
                if (state === 'value') {
                    if (value !== previous) {
                        diff[hash] = 'changed';
                    }
                }
                else if (state === 'missing') {
                    // 缺失后重新出现视为新增
                    diff[hash] = 'added';
                }
                // state 为 init 时说明是最旧的有效版本，不标记
                previous = value;
                state = 'value';
            }
        }
        if (Object.keys(diff).length > 0) {
            row[diffKey] = diff;
        }
        if (row.children) {
            annotateRows(row.children as DataTableRowData[], revisions);
        }
    }
}

function getKeyDescription(key: ComponentKey, path: ModUnitInfo['path']) {
    const basename = path.split('/').pop()!;
    switch (key) {
        case 'ib':
            return `TextureOverride${basename}IB`;
        case 'position_vb':
            return `TextureOverride${basename}Position`;
        case 'blend_vb':
            return `TextureOverride${basename}Blend`;
        case 'draw_vb':
            return `TextureOverride${basename}VertexLimitRaise`;
        case 'texcoord_vb':
            return `TextureOverride${basename}Texcoord`;
    }
}

export function modUnitToDataTable(info: ModUnitInfo, map: CommitMap, githubRepoURL: string) {
    const columns: DataTableColumn[] = [{
        title: '参数',
        key: firstColumnKey,
        width: 150,
        fixed: 'left',
        titleAlign: 'center',
        render: (rowData) => {
            const key = rowData[firstColumnKey] as ComponentKey;
            const description = getKeyDescription(key, info.path);
            if (description) {
                return h(ViewerTooltip, { content: { label: key, description } });
            }
            else {
                return key;
            }
        },
    }];
    const components: Record<string, DataTableRowData[]> = {};
    for (const revision of info.revisions) {
        columns.push({
            title: () => h(ViewerTooltip, {
                commit: map.get(revision.hash)!,
                githubRepoURL,
                path: info.path,
            }),
            key: revision.hash,
            align: 'center',
        });
    }
    for (const revision of info.revisions) {
        if (!revision.content) {
            continue;
        }
        for (const gimiComponent of revision.content) {
            const rows = components[gimiComponent.component_name] ??= [];
            for (let i = 0; i < componentKeys.length; ++i) {
                const componentKey = componentKeys[i];
                if (gimiComponent[componentKey]) {
                    const row = rows[i] ??= { [firstColumnKey]: componentKey };
                    row[revision.hash] = gimiComponent[componentKey];
                }
            }
            for (let i = 0; i < gimiComponent.object_classifications.length; ++i) {
                const objectName = gimiComponent.object_classifications[i];
                const objectIndex = gimiComponent.object_indexes[i];
                const row = rows[componentKeys.length + i] ??= {
                    [firstColumnKey]: `物体 IB ${i + 1}`,
                    children: [],
                };
                row[revision.hash] = `${objectName} (${objectIndex})`;
                const objectRows = row.children;
                for (let j = 0; j < gimiComponent.texture_hashes[i].length; ++j) {
                    const texture = gimiComponent.texture_hashes[i][j];
                    objectRows[j] ??= { [firstColumnKey]: `贴图 ${j + 1}` };
                    objectRows[j][revision.hash] = `${texture[0]}${texture[1]}: ${texture[2]}`;
                }
            }
        }
    }
    for (const [name, value] of Object.entries(components)) {
        components[name] = value.filter(value => value);
        annotateRows(components[name], info.revisions);
    }

    return { columns, components } as const;
}
