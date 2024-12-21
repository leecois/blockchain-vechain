import AuthenticatedPage from '@/components/authenticated-page'
import Section from '@/components/section'
import { links } from '@/lib/links'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useState } from 'react'
import { createWalletClient, custom, isAddress, parseEther } from 'viem'
import { baseGoerli } from 'viem/chains'
import { useVeChainAccount } from '@/lib/useVeChainAccount'

const EmbeddedWallet = () => {
	const vechain = useVeChainAccount()
	const { signMessage, sendTransaction, exportWallet } = usePrivy()
	const { wallets } = useWallets()
	const embeddedWallet = wallets.find(
		(wallet) => wallet.walletClientType === 'privy'
	)

	// Signature state
	const [signature, setSignature] = useState<string | undefined>()

	// Transaction state
	const [recipientAddress, setRecipientAddress] = useState<string | undefined>()
	const [txHash, setTxHash] = useState<string | undefined>()
	const [txIsLoading, setTxIsLoading] = useState(false)

	const onSign = async () => {
		try {
			const _signature = await signMessage(
				'I logged into the Privy PWA demo and signed this message!'
			)
			setSignature(_signature)
		} catch (e) {
			console.error('Signature failed with error ', e)
		}
	}

	const onTransfer = async () => {
		if (!vechain.address) return
		try {
			setTxIsLoading(true)
			const _txHash = await vechain.sendTransaction({
				to: recipientAddress as `0x${string}`,
				value: parseEther('0.004'),
			})
			setTxHash(_txHash)
			// const _txHash = await vechain.sendTransaction({
			// 	to: recipientAddress as `0x${string}`,
			// 	value: '0',
			// 	data: {
			// 		abi: [
			// 			{
			// 				inputs: [
			// 					{
			// 						internalType: 'address',
			// 						name: 'owner',
			// 						type: 'address',
			// 					},
			// 					{
			// 						internalType: 'string',
			// 						name: 'name',
			// 						type: 'string',
			// 					},
			// 					{
			// 						internalType: 'string',
			// 						name: 'location',
			// 						type: 'string',
			// 					},
			// 					{
			// 						internalType: 'string[]',
			// 						name: 'certifications',
			// 						type: 'string[]',
			// 					},
			// 				],
			// 				name: 'registerFarm',
			// 				outputs: [
			// 					{
			// 						internalType: 'uint256',
			// 						name: '',
			// 						type: 'uint256',
			// 					},
			// 				],
			// 				stateMutability: 'nonpayable',
			// 				type: 'function',
			// 			},
			// 		],
			// 		functionName: 'registerFarm',
			// 		args: [
			// 			vechain.address,
			// 			'Farm Name', 
			// 			'Farm Location', 
			// 			['Cert1', 'Cert2'],
			// 		],
			// 	},
			// })
		} catch (e) {
			console.error('Transfer failed with error ', e)
			setTxIsLoading(false)
		}
	}

	return (
		<AuthenticatedPage>
			<Section>
				<p className='text-md mt-2 font-bold uppercase text-gray-700'>
					Your VeChain Address
				</p>
				<textarea
					value={vechain.address}
					className='mt-4 h-12 w-full rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50 disabled:opacity-25'
					rows={1}
					readOnly
				/>
			</Section>
			<Section>
				<p className='text-md mt-2 font-bold uppercase text-gray-700'>
					Sign a message
				</p>
				<p className='mt-2 text-sm text-gray-600'>
					Sign a message to verify you&apos;ve used this demo!
				</p>
				<button
					type='button'
					className='mt-2 w-full rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
					onClick={onSign}
				>
					Sign Message
				</button>
				<textarea
					value={signature || 'No signature yet'}
					className='mt-4 h-fit w-full rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50'
					rows={3}
					readOnly
				/>
			</Section>
			<Section>
				<p className='text-md mt-8 font-bold uppercase text-gray-700'>
					Transfer ETH
				</p>
				<p className='mt-2 text-sm text-gray-600'>
					Transfer Goerli ETH from your embedded wallet. Enter a valid recipient
					address to enable the button.
				</p>
				<input
					type='text'
					id='recipient-address'
					placeholder='0x123...'
					autoComplete='off'
					onChange={(e: React.FormEvent<HTMLInputElement>) =>
						setRecipientAddress(e.currentTarget.value)
					}
					className='form-input mt-2 w-full rounded-lg border-2 border-gray-200 px-4 py-3'
				/>
				<button
					type='button'
					className='mt-2 w-full rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm disabled:bg-indigo-400'
					disabled={
						!recipientAddress || !isAddress(recipientAddress) || txIsLoading
					}
					onClick={onTransfer}
				>
					Transfer 0.004 ETH
				</button>
				{txHash && (
					<p className='mt-2 text-sm italic text-gray-600'>
						See your transaction on{' '}
						<a
							className='underline'
							href={`${links.baseGoerli.transactionExplorer}${txHash}`}
							target='_blank'
							rel='noreferrer noopener'
						>
							etherscan
						</a>
						.
					</p>
				)}
			</Section>
			<Section>
				<p className='text-md mt-8 font-bold uppercase text-gray-700'>
					Export your private key
				</p>
				<p className='mt-2 text-sm text-gray-600'>
					Export your embedded wallet&apos;s private key to use in another
					wallet client.
				</p>
				<button
					type='button'
					className='mt-2 w-full rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm'
					onClick={exportWallet}
				>
					Export key
				</button>
			</Section>
			<Section>
				<p className='text-md mt-8 font-bold uppercase text-gray-700'>
					Learn more
				</p>
				<p className='mt-2 text-sm text-gray-600'>
					Read our{' '}
					<a
						className='underline'
						href={links.docs.embeddedWallets}
						target='_blank'
						rel='noreferrer noopener'
					>
						docs
					</a>{' '}
					to learn more about using embedded wallets in your app.
				</p>
			</Section>
		</AuthenticatedPage>
	)
}

export default EmbeddedWallet