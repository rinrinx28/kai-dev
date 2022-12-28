//* Import Module Systems
import { useState } from "react";
import './Home.css'
import logo from '../image/logo2.png'

export default function Home() {
    const [data, setData] = useState({ x: 0, y: 0 })

    const _onMouseMove = (e) => {
        const width = e.target.clientWidth;
        const height = e.target.clientHeight;
        const oX = (e.nativeEvent.offsetX / width) * 100;
        const oY = (e.nativeEvent.offsetY / height) * 100;
        var datas = {
            x: oX,
            y: oY
        }
        setData(datas)
    }

    const _onMouseOut = () => {
        var datas = {
            x: 0,
            y: 0
        }
        setData(datas)
    }
    const maskStyle = {
        '--maskX': data.x,
        '--maskY': data.y
    }
    return (
        <div className="bg-black h-screen items-center text-center mx-auto flex flex-col justify-center loader">
            <img className="h-50 object-cover rounded-xl small:w-[384px]" src={logo} width={512} alt='logo' />
            <div className="titleContainer font-Redsniper text-7xl"
                onMouseMove={_onMouseMove}
                onMouseOut={_onMouseOut}
                style={maskStyle}
            >
                <div className="titleWrapper small:text-5xl">
                    <h1>COMING SOON!</h1>
                </div>
                <div className="titleWrapper cloneWrapper small:text-5xl">
                    <h1>COMING SOON!</h1>
                </div>
            </div>
        </div>
    )
}