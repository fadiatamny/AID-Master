import { Dictionary } from '../models/Dictionary.model'
import ScenarioMap from '../models/ScenarioMap.model'
import { generateScenarioThemeMap } from '../models/ScenarioTheme.model'

export default class ScenarioUtils {
    public static organizeByCategory(scenario: Dictionary) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const organized: Record<string, { [key: string]: any }> = {}

        for (const feature in Object.keys(scenario)) {
            const category = ScenarioMap[feature]
            if (!organized[category]) {
                organized[category] = [{ [feature]: scenario[feature] }]
            } else {
                organized[category].push([{ [feature]: scenario[feature] }])
            }
        }
        return organized
    }

    public static fetchTheme(scenario: Dictionary) {
        /**
         * Intense: ie. important trade, running away, any big stress situation ||
         * Battle: ie. battle, boss battle, any battle exposition               ||
         * Relaxed: ie. regular conversation, casual travel                     ||  This function needs optimization
         * Mysterious: ie. weird conversation, puzzle rooms, big investigate    ||
         * Rewarding: ie. reward time bb                                        ||
         */

        const map = generateScenarioThemeMap()
        const featuresCount = Object.keys(scenario).length

        for (const sFeature in Object.keys(scenario)) {
            for (const key in Object.keys(map)) {
                for (const feature in Object.keys(map[key])) {
                    if (feature === sFeature) {
                        ++map[key][feature]
                    }
                }
            }
        }

        let max = -Infinity
        let theme = ''
        for (const key in Object.keys(map)) {
            let count = 0
            for (const feature in Object.keys(map[key])) {
                if (map[key][feature] !== 0) {
                    ++count
                }
            }
            if (count / featuresCount > max) {
                max = count / featuresCount
                theme = key
            }
        }

        return theme
    }
}
