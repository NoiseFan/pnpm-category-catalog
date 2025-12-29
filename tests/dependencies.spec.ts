import type { IWorkSpaceCataLogs, IWorkSpaceContext } from '@/types'
import { describe, expect, it } from 'vitest'
import { normalizerDependencies, normalizerTargetVersion } from '@/dependencies'

describe('normalizeTargetVersion', () => {
    it('has categories', () => {
        const catalogs: IWorkSpaceCataLogs = {
            choice: ['tsdown'],
            name: 'build',
            dependencies: { tsdown: '^0.18.2' },
            categories: [{
                name: 'build',
                packages: ['tsdown'],
                dependencies: { tsdown: '^0.18.2' },
            }],
        }
        expect(normalizerTargetVersion(catalogs, 'tsdown')).toBe('catalog:build')
    })

    it('don\'t has categories', () => {
        const catalogs: IWorkSpaceCataLogs = {
            choice: ['tsdown'],
            name: 'build',
            dependencies: { tsdown: '^0.18.2' },
        }
        expect(normalizerTargetVersion(catalogs, 'tsdown')).toBe('catalog:build')
    })

    it('categories is empty', () => {
        const catalogs: IWorkSpaceCataLogs = {
            choice: ['tsdown'],
            name: 'build',
            dependencies: { tsdown: '^0.18.2' },
            categories: [],
        }
        expect(normalizerTargetVersion(catalogs, 'tsdown')).toBe('catalog:build')
    })
})

describe('normalizerDependencies', () => {
    it('should normalize dependencies correctly', () => {
        const pkgData = {
            devDependencies: {
                bumpp: 'catalog:',
                eslint: 'catalog:',
            },
        }
        const workspace: IWorkSpaceContext = {
            path: 'demo/pnpm-workspace.yaml',
            context: 'catalogs:\n newCata:\n bumpp: ^10.3.2\n eslint: ^9.39.2\n',
            catalogs: {
                choice: ['bumpp', 'eslint'],
                name: 'newCata',
                dependencies: {
                    bumpp: '^10.3.2',
                    eslint: '^9.39.2',
                },
            },
        }

        expect(normalizerDependencies(pkgData, workspace)).toBeTruthy()
    })
})
