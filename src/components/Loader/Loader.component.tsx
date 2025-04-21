export const Loader = () => {
    return (
        <div className='h-screen w-full flex flex-col items-center justify-center loader'>
            <img src='/icons/c01d.svg' className='w-40 h-40'/>
            <div className='text-3x font-bold text-white'>Loading</div>
        </div>
    )
}