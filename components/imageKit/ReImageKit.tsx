"use client"

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { IoIosCloseCircleOutline } from "react-icons/io"
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import Imagekit from './ImageKit'

interface ImageKitProps {
    id: string
    initialUrl?: string
    onSuccess: (res: any) => void;
    isMultiple?: boolean;
    imgClassName?: string;
    containerClassName?: string;

    btnText?: string;
    btnClassName?: string;
    btnIcon?: any

    isAlwaysBtn?: boolean;
    isImgPreview?: boolean;
}

const ReImageKit: React.FC<ImageKitProps> = ({ id, initialUrl, isMultiple = false, imgClassName, containerClassName, btnText = 'Add attachment', btnClassName, btnIcon = <Plus className="w-4 h-4" />, isImgPreview = true, isAlwaysBtn, onSuccess }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null)
    const hiddenFileInput = useRef<HTMLDivElement | null>(null)

    const triggerFileInput = () => {
        if (hiddenFileInput.current) {
            const inputElement = hiddenFileInput.current.querySelector("input[type='file']") as HTMLInputElement
            if (inputElement) {
                inputElement.click()
            }
        }
    }

    const handleUploadSuccess = (res: any) => {
        const imgUrl: string = res.url
        setPreviewUrl(imgUrl)
        onSuccess(res)
    }

    return (
        <>
            {(!previewUrl || isAlwaysBtn) && (
                <Button
                    type='button'
                    size={btnText ? 'default' : 'icon'}
                    variant="outline"
                    className={` ${btnClassName}`}
                    onClick={triggerFileInput}
                >
                    {btnIcon}
                    {btnText}
                </Button>
            )
            }
            <div>
                <div ref={hiddenFileInput}>
                    <Imagekit
                        multiple={isMultiple}
                        id={id}
                        onSuccess={handleUploadSuccess}
                    />
                </div>
                {previewUrl && isImgPreview && (
                    <div className={`mt-4 relative inline-block ${containerClassName}`}>
                        <Image
                            src={previewUrl}
                            alt="Attached image"
                            width={200}
                            height={200}
                            loading="lazy"
                            className={`object-cover h-auto w-auto sm:max-w-[15rem] ${imgClassName}`}
                        />
                        <button
                            type="button"
                            className="absolute -top-1 -right-1 bg-white rounded-full hover:rotate-180 transition hover:scale-110 transform focus:outline-none"
                            onClick={() => setPreviewUrl(null)}
                        >
                            <IoIosCloseCircleOutline className="text-blueCustom size-4 sm:size-5" />
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default ReImageKit