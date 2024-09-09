import React, { Dispatch, FC, SetStateAction } from "react";
import ImageUploading, { ImageListType, ImageType } from "react-images-uploading";
import { PetitionButton } from "../Button/PetitionButton";

interface IUploadImages {
    images: never[];
    setImages: Dispatch<SetStateAction<never[]>>
}


export function UploadImages ({images, setImages} : IUploadImages) {

    const maxNumber = 10;

    const onChange = (
        imageList: ImageListType,
        addUpdateIndex: number[] | undefined
    ) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        setImages(imageList as never[]);
        
    };

    return (
        <div className="App">

            <ImageUploading
            multiple
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
        >
        {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageRemove,
        }) => (
          // write your building UI
            <div className="upload__image-wrapper" style={{marginTop: '15px'}}>
                <PetitionButton
                    text ={'Add image'}
                    onClick={onImageUpload}
                />
                    

            &nbsp;
            <PetitionButton text={'Remove all images'} onClick={onImageRemoveAll} />

            {imageList.map((image, index) => (
                <div key={index} className="image-item" style={{margin: '15px 0', width: '300px'}}>
                    <img src={image.dataURL} alt="" width="300px" />
                    <div className="image-item__btn-wrapper" style={{marginTop: '15px', display: 'flex' ,justifyContent: 'center'}}>
                        <PetitionButton text={'Remove'} onClick={() => onImageRemove(index)} />
                    </div>
                </div>
            ))}
            </div>
        )}
        </ImageUploading>
    </div>
);
}
