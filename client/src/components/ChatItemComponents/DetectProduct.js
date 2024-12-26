import React from 'react'

const DetectProduct = ({ data }) => {
    const { imageProduct, titleProduct, priceProduct, urlProduct } = data;

    const openPageProduct = () => {
        window.open(urlProduct)
    }

    return (
        <div onClick={openPageProduct} className='flex rounded-r-lg rounded-b-lg bg-gray-100 text-gray-800 self-start max-w-[85%] px-3 text-sm py-2 whitespace-pre-line break-words cursor-pointer'>
            <img src={imageProduct} alt="Product" className="w-20 h-24" />
            <div className='flex flex-col text-xs gap-2 pl-2 grow'>
                <span className='font-semibold'>{titleProduct}</span>
                <span className='text-orange-600'>{priceProduct}</span>
            </div>
        </div>
    )
}

export default DetectProduct