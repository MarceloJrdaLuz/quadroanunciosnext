import { useEffect, useState } from "react";
import Botao from "../components/Botao";
import GeradorPdf from "../components/GeradorPdf";
import LayoutPrincipal from "../components/LayoutPrincipal";
import { meses } from "../functions/meses";
import HeadComponent from "../components/HeadComponent";
import loading from '../components/Icons/loading-menor.gif'
import Image from "next/image";


export default function Cartas() {

    const [pdfShow, setPdfShow] = useState(false)

    const [visivel, setVisivel] = useState(false) //

    const [visivelCartas, setVisivelCartas] = useState(false) //

    const [item, setItem] = useState<'' | 'Carta1' | 'Carta2' | 'Assembleias' | 'Congresso' | 'Visita'>('')

    const [rotate, setRotate] = useState(0)

    const [cartas, setCartas] = useState([])

    useEffect(() => {
        const dados = fetch('https://bituruna-uploads.herokuapp.com/posts')
        .then(res => res.json())
        .then(data => setCartas(data))
    }, [])

    console.log(cartas)

    function exibirCartas() {
        return (
            <div className="flex justify-between w-full md:w-4/5">
                {cartas.length > 0 ? cartas.map(obj => (
                    obj.name.includes('Carta') && (
                        <Botao key={obj.name} onClick={() => { setItem(obj.name.replace('.pdf', '')), setPdfShow(true), setRotate(0) }} texto={obj.name.replace('.pdf', '')} />
                    )
                )): (
                    <div className="flex relative justify-center items-center w-12 h-12 m-auto">
                        <Image layout="fill" src={loading} alt="Gif de carregamento"></Image>
                    </div>
                )}
            </div>
        )
    }


    function renderizarPdf(item?: string) {
        return (
            <GeradorPdf nomeArquivo={item} rotate={rotate} setPdfShow={setPdfShow} />
        )
    }

    function renderizarBotoesEventos() {
        return (
            <div className="flex justify-between w-full md:w-4/5">
                <Botao onClick={() => { setItem('Assembleias'), setPdfShow(true), setRotate(90) }} texto='Assembleias' />

                <Botao onClick={() => { setItem('Congresso'), setPdfShow(true) }} texto='Congresso' />

                <Botao onClick={() => { setItem('Visita'), setPdfShow(true), setRotate(90) }} texto='Visita do SC' />
            </div>
        )
    }
    return !pdfShow ? (
        <>
            <HeadComponent title="Cartas" urlMiniatura="https://bituruna.netlify.app/images/cartas.jpg" />
            <LayoutPrincipal textoHeader="Cartas" heightConteudo={'1/2'} header className="bg-cartas bg-left-bottom bg-cover lg:bg-right">
                <div className="linha bg-gray-500 mt-2 w-full h-0.5 md:w-4/5"></div>

                <Botao texto={`Cartas do mês de ${meses[new Date().getMonth()]}`} onClick={() => { setVisivelCartas(true), setVisivel(false)}} />

                {visivelCartas ? exibirCartas() : null}

                <Botao texto={`Eventos Especiais`} onClick={() => { setVisivel(true), renderizarBotoesEventos(), setVisivelCartas(false) }} />

                {visivel ? renderizarBotoesEventos() : null}

                <Botao href='/' texto='Voltar' />
            </LayoutPrincipal>
        </>
    ) : (
        renderizarPdf(item)
    )
}