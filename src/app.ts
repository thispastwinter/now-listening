import { checkForUpdate } from "./utils/checkForUpdate/checkForUpdate"
import { Messages } from "./constants/messages"
import { MusicProvider } from "./types/MusicProvider"
import { getAnswers } from "./utils/getAnswers/getAnswers"
import { getCredentials } from "./utils/getCredentials"
import { statusTask } from "./utils/statusTask/statusTask"
import { writeCredentials } from "./utils/writeCredentials"
import packageJson from "package-json"
import localPackage from "../package.json"
import nodeCron from "node-cron"
import boxen from "boxen"
import { getUpdateMessage } from "./utils/checkForUpdate"

export const app = async () => {
  let token = ""
  let provider: MusicProvider = "Music"
  const { name } = localPackage

  try {
    const latestPackage = await packageJson(name)
    const metaData = await checkForUpdate(latestPackage, localPackage)

    if (metaData) {
      const message = getUpdateMessage({ ...metaData, name })

      console.log(
        boxen(message, {
          padding: 1,
          margin: {
            top: 1,
            bottom: 1,
          },
          borderStyle: "round",
        }),
      )
    }

    const credentials = getCredentials()
    console.log(Messages.read_success)
    token = credentials.token
    provider = credentials.provider
  } catch (err) {
    const answers = await getAnswers()
    token = answers.token
    provider = answers.options[0]
    const content = JSON.stringify({
      token,
      provider,
    })

    writeCredentials(content)
  }

  nodeCron.schedule("* * * * *", async () => await statusTask(provider))
}
