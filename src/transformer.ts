import type { CommitMap, ModUnitInfo } from '@/library-collection';
import type { DataTableColumn, DataTableRowData } from 'naive-ui';
import ViewerTooltip from '@/components/ViewerTooltip.vue';
import { h } from 'vue';

type ComponentKey = typeof componentKeys[number];

const componentKeys = ['ib', 'position_vb', 'blend_vb', 'draw_vb', 'texcoord_vb', 'root_vs', 'first_vs'] as const;
const firstColumnKey = 'argument';

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
    }

    return { columns, components } as const;
}
