import { expect, use } from 'chai'
import { sha256, toByteString } from 'scrypt-ts-btc'
import { BtcDemo } from '../src/contracts/btcDemo'
import { getDefaultSigner } from './utils/txHelper'
import chaiAsPromised from 'chai-as-promised'
use(chaiAsPromised)

describe('Test SmartContract `BtcDemo`', () => {
    let instance: BtcDemo

    before(async () => {
        await BtcDemo.loadArtifact()

        instance = new BtcDemo(sha256(toByteString('hello world', true)))
        await instance.connect(getDefaultSigner())
    })

    it('should pass the public method unit test successfully.', async () => {
        const deployTx = await instance.deploy(1)
        console.log(`Deployed contract "BtcDemo": ${deployTx.id}`)

        // Wait for 10 seconds...
        await new Promise((resolve) => setTimeout(resolve, 10000))

        const call = async () => {
            const callRes = await instance.methods.unlock(
                toByteString('hello world', true)
            )

            console.log(`Called "unlock" method: ${callRes.tx.id}`)
        }
        await expect(call()).not.to.be.rejected
    })
})
