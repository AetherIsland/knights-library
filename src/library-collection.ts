export interface Commit {
    hash: string;
    date: string;
    message: string;
    body: string;
}

export interface EmitIndex {
    id: string;
    displayName: string;
}

export interface GIMIComponentInfo {
    component_name: string;
    root_vs: string;
    draw_vb: string;
    position_vb: string;
    blend_vb: string;
    texcoord_vb: string;
    ib: string;
    object_indexes: number[];
    object_classifications: string[];
    texture_hashes: [type: string, ext: string, hash: string][][];
    first_vs: string;
}

export interface HashRevision {
    hash: string;
    content: GIMIComponentInfo[] | null;
}

export interface Metadata {
    head: string;
    commits: Commit[];
    index: EmitIndex[];
}

export interface ModUnitInfo {
    path: string;
    seenInHead: boolean;
    revisions: HashRevision[];
}

export type CollectionName = typeof collectionNames[number];
export type CommitMap = ReadonlyMap<string, Commit>;
export type ModUnitId = EmitIndex['id'];

export const collectionNames = ['GIMI', 'SRMI', 'HIMI', 'ZZMI'] as const;
export const githubRepo = {
    GIMI: {
        repo: 'GI-Model-Importer-Assets',
        owner: 'SilentNightSound',
        description: 'Asset files that can be used with the GI-Model-Importer for a certain anime game',
    },
    SRMI: {
        repo: 'SR-Model-Importer-Assets',
        owner: 'SilentNightSound',
        description: 'Asset files that can be used with the SR-Model-Importer for a certain anime game number 2',
    },
    HIMI: {
        repo: 'HI-Model-Importer-Assets',
        owner: 'SilentNightSound',
        description: 'Asset files that can be used with the HI-Model-Importer for a certain anime game #3',
    },
    ZZMI: {
        repo: 'ZZ-Model-Importer-Assets',
        owner: 'leotorrez',
        description: undefined,
    },
} as const;

const commitMapPromises: Record<string, Promise<CommitMap>> = {};
const importers = import.meta.glob([
    './generated/library-collection/*/*.json',
], { import: 'default' });

export function getMetadata(collection: CollectionName) {
    return importers[`./generated/library-collection/${collection}/_metadata.json`]() as Promise<Metadata>;
}

export function getModUnitInfo(collection: CollectionName, id: ModUnitId) {
    return importers[`./generated/library-collection/${collection}/${id}.json`]() as Promise<ModUnitInfo>;
}

export function getCommitMap(collection: CollectionName) {
    return commitMapPromises[collection] ??= getMetadata(collection).then((metadata) => {
        const map = new Map<string, Commit>();
        for (const commit of metadata.commits) {
            map.set(commit.hash, commit);
        }
        return map;
    });
}
