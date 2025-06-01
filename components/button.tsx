export default function Button({ text , onClick}: { text: string , onClick: any}) {
    return (
        <>
            <button 
            className="rounded-xl py-2 px-4 border border-transparent text-center text-sm text-white transition-all 
            shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none 
            disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none bg-[#001d3d]" type="button"
            onClick={onClick}>
                {text}
            </button>
        </>
    )
}