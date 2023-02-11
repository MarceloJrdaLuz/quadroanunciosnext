import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { Document, Page } from "react-pdf";
import { IconeSeta, IconeSetaDireita, IconeSetaEsquerda, IconeVoltar, IconeRotacao } from "./Icons/Icons";
import loading from './Icons/loadin.gif'



interface GeradorPdfProps {
    nomeArquivo?: string
    rotate?: number
    setPdfShow: Dispatch<SetStateAction<boolean>>
}
export default function GeradorPdf(props: GeradorPdfProps) {

    const [renderBtn, setRenderBtn] = useState(true)
    const [numPages, setNumPages] = useState(null)
    const [numberPage, setNumberPage] = useState(1)
    const [rotacao, setRotacao] = useState(props.rotate ? props.rotate : 0)
    const ultimaPagina = numPages
    const primeiraPagina = numPages - numPages + 1

    function onDocumentLoadSuccess({ numPages }) {
        setRenderBtn(true)
        renderizarBotoes()
        setNumPages(numPages)
    }

    function renderError() {
        setRenderBtn(false)
        return (
            <div className="bg-gray-300 h-screen w-screen flex justify-center items-center">
                <div className="text-2xl text-center font-semibold text-gray-900  bg-teste-200 px-20 py-10 shadow shadow-slate-900  md:px-32 md:py-12 rounded-lg w-5/6">Arquivo não disponível</div>
                <div onClick={()=> props.setPdfShow(false)} className="absolute flex justify-start rounded-full bg-teste-200 p-2 hover:border hover:border-teste-100 top-10">
                    {IconeSeta}Voltar
                </div>
            </div>
        )
    }

    function renderizarBotoes() {
        return renderBtn ? (
            <div className="flex w-full max-w-fit md:justify-center">
                <div onClick={() => props.setPdfShow(false)} className="ml-2 pb-1">
                    Voltar
                    {IconeVoltar}
                </div>

                <div className="flex mr-4 w-96 justify-center">
                    <div
                        onClick={() => numberPage > 1 ? setNumberPage(numberPage - 1) : setNumberPage(ultimaPagina)}
                        className="flex flex-col justify-center items-center pb-1">
                        Anterior
                        {IconeSetaEsquerda}
                    </div>
                    <div
                        onClick={() => numberPage < numPages ? setNumberPage(numberPage + 1) : setNumberPage(primeiraPagina)}
                        className="flex flex-col ml-4 justify-center items-center pb-1">
                        Seguinte
                        {IconeSetaDireita}
                    </div>
                    <div
                    onClick={()=>{setRotacao(rotacao === 0 ? rotacao + 90 : rotacao -90)}}
                    className="flex flex-col ml-4 justify-center items-center pb-1"
                    >
                        Girar
                        {IconeRotacao}
                    </div>
                </div>
            </div>
        ) : null
    }
    return (
        <section className="flex flex-col h-screen w-screen items-center justify-center  overflow-auto bg-gray-200">

            <Document
                file={`${process.env.NEXT_PUBLIC_AWS_LINK}-${props.nomeArquivo}.pdf?rand=${Date.now()}`}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<Image src={loading} alt="Gif de carregamento"></Image>}
                error={renderError}
                rotate={rotacao}
            >
                <Page
                    height={570}
                    pageNumber={numberPage}
                />
            </Document>
            {renderizarBotoes()}
        </section>
    )
}