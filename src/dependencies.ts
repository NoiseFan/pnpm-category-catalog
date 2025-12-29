import type { IConfig, IUpdatePackage, IWorkSpaceCataLogs, IWorkSpaceContext } from '@/types'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { DEPENDENCY_TYPES } from '@/constant.ts'

export const normalizerTargetVersion = (catalogs: IWorkSpaceCataLogs, depName: string): string => {
    if (catalogs.categories) {
        const category = catalogs.categories.find(cat => cat.dependencies[depName])
        // 如果有分类信息，使用对应的分类名称
        return `catalog:${category ? category.name : catalogs.name}`
    }
    else {
        // 兼容单个分类的情况
        return `catalog:${catalogs.name}`
    }
}
export const normalizerDependencies = (pkgData: any, workspace: IWorkSpaceContext) => {
    let isUpdated = false
    DEPENDENCY_TYPES.forEach((depType) => {
        const dependencies = pkgData[depType]
        if (!dependencies)
            return
        Object.keys(dependencies).forEach((depName) => {
            // 检查该依赖是否命中 workspace 的 catalog 配置
            if (!workspace.catalogs.dependencies[depName])
                return
            const targetVersion = normalizerTargetVersion(workspace.catalogs, depName)

            // 只有在版本不一致时才标记更新，避免不必要的改动
            if (dependencies[depName] === targetVersion)
                return
            dependencies[depName] = targetVersion
            isUpdated = true
        })
    })
    return isUpdated
}
export const resolvePackageDependencies = (
    config: IConfig,
    packagePathMap: string[],
    workspace: IWorkSpaceContext,
): IUpdatePackage[] => {
    return packagePathMap.map((path: string) => {
        const filePath = resolve(config.cwd, path)
        const fileContent = readFileSync(filePath, 'utf-8')
        const pkgData = JSON.parse(fileContent)

        const isUpdated = normalizerDependencies(pkgData, workspace)
        return {
            path: filePath,
            context: isUpdated ? `${JSON.stringify(pkgData, null, 2)}\n` : fileContent,
            isUpdate: isUpdated,
        }
    })
}
