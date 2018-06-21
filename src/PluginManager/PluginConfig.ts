interface ConfigWithNameAndPackage {
  name: string
  package: string
}
type PluginConfig<TConfig> = ConfigWithNameAndPackage & { [K in keyof TConfig]: TConfig[K] }

export default PluginConfig
