import React, { useRef, useState } from 'react'
import styled from "styled-components"
import img from "./img.png"
import { providers} from "ethers"
import Web3Modal from "web3modal"


const App = () => {

  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const [ens, setEns] = useState("")

  const [address, setAddress] = useState("")

  const web3ModalRef = useRef()

  const setEnsOrAddress = async (address, web3Provider) => {
    let myens = await web3Provider.lookupAddress(address);
    console.log(myens)
    if(myens){
      setEns(myens)
    }else{
      setAddress(address)
    }
  }

  const getSignerOrProvider = async () => {
    const provider = await web3ModalRef.current.connect();
    console.log(provider)
    const web3Provider = new providers.Web3Provider(provider)
    console.log(web3Provider)
    const {chainId} = await web3Provider.getNetwork()
    if(chainId !== 5){
      alert("Please change network to Goerli test net")
      throw new Error ("Please change network to Goerli test net")
    }else{
      const signer =  web3Provider.getSigner();
      const address = await signer.getAddress()
      setEnsOrAddress(address, web3Provider)

    }
  }

  const connectWallet = async  () => {
    try {
    await  getSignerOrProvider()
    setIsWalletConnected(true)
    } catch (error) {
      console.log(error)
      alert(`${error}`)
    }
  }

  React.useEffect(()=>{
    if(!isWalletConnected){
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false
      })
      connectWallet()
    }
  },[isWalletConnected])

  return (
    <Container>
      <Wrapper>
        <TextCont>
          <Title>
            Welcome to Confidence Web3 .eth Check - {ens? ens: "you haven't registered this account in ENS"}
          </Title>
          <Sub>It's an NFT  collection for Confidence students</Sub>
          {!isWalletConnected? 
          <Connect
          onClick={connectWallet}
          >Connect Wallet</Connect>
          : 
          <Connect
          style={{
          background: "red"
          }}
          >Wallet Connected</Connect>
           }
        </TextCont>
        <Image src={img}/>
      </Wrapper>
    </Container>
  )
}

export default App

const Connect = styled.div`
width: 180px;
height: 50px;
display:flex;
background-color: blue;
color: white;
justify-content: center;
align-items: center;
`


const Sub = styled.div`
font-size: 14px;
font-family: Arial, Helvetica, sans-serif;
color: gray;
margin: 15px 0;
`
const Title = styled.div`
font-size: 36px;
font-weight: bold;
letter-spacing: 0.2px;
font-family: Arial, Helvetica, sans-serif;
line-height: 50px;
@media screen and (max-width: 800px){
  text-align: center;
  width: 100%;
  flex-wrap: wrap;
overflow: hidden;
}
@media screen and (max-width: 600px){
  font-size: 30px;
}
@media screen and (max-width: 500px){
  font-size: 25px;
  line-height: 45px;
}
@media screen and (max-width: 380px){
  font-size: 22px;
  line-height: 45px;
}
@media screen and (max-width: 325px){
  font-size: 20px;
}
`
const Image = styled.img`
width: 650px;
height: 100%;
object-fit: cover;
@media screen and (max-width: 1100px){
  width: 500px;
  
}
@media screen and (max-width: 600px){
  width: 100%;
}
/* background-color: red; */
`


const TextCont = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
@media screen and (max-width: 800px){
  width: 100%;
  align-items: center;
  margin-top: 30px;
}
`

const Wrapper = styled.div`
width: 90%;
display: flex;
align-items: center;
justify-content: space-between;
@media screen and (max-width: 800px){
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: column-reverse;
}
`
const Container = styled.div`
width: 100%;
min-height: 100vh;
height: 100%;
display:flex;
justify-content: center;
align-items: center;
`