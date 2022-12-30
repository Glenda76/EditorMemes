import React, { useEffect, useState } from 'react';
import './meme.css';


const Meme = () => {

  const [memes, setMemes] = useState([]);
  const [memeIndex, setMemeIndex] = useState(0);
  const [captions, setCaptions] = useState([]);
  const [memeGenerado, setMemeGenerado]=  useState({url:'', bandera:false});
  

  const updateCaption = (e, index) => {
    const text = e.target.value || '';
    setCaptions(
      captions.map((c, i) => {
        if(index === i) {
          return text;
        } else {
          return c;
        }
      })
    );
  };

  const skipearMeme = ()=>{
    setMemeIndex(memeIndex + 1);
    setMemeGenerado({url:'', bandera:false})
  }

  const generarMeme = () => {
    const currentMeme = memes[memeIndex];
    const formData = new FormData();

    formData.append('username', 'glenchus');
    formData.append('password', '123456grpd');
    formData.append('template_id', currentMeme.id);
    captions.forEach((c, index) => formData.append(`boxes[${index}][text]`, c));

    fetch('https://api.imgflip.com/caption_image', {
      method: 'POST',
      body: formData
    }).then(res => {
      res.json().then(res => {
        console.log(res);
        setMemeGenerado({url:res.data.url, bandera:true})
      });
    });
  };

  const memeRandom = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes').then(res => {
      res.json().then(res => {
        console.log(res);
        const _memes = res.data.memes;
        memeRandom(_memes);
        setMemes(_memes);
      });
    });
  }, []);

  useEffect(() => {
    if(memes.length) {
      setCaptions(Array(memes[memeIndex].box_count).fill(''));
    }
  }, [memeIndex, memes]);

  return(
    memes.length ? 
    <div className="container">
      <button onClick={skipearMeme} className="skip">Buscar Meme</button>
      <button onClick={generarMeme} className="generate">Generar Meme</button>
      {
        captions.map((c, index) => (
          <input onChange={(e) => updateCaption(e, index)} key={index} />
          
        ))
      }
      <img alt='meme' src={memeGenerado.bandera ? memeGenerado.url : memes[memeIndex].url} />
      {memeGenerado.bandera && <a className="link-meme" href={memeGenerado.url}  target="_blank" rel="noreferrer" > Descargar tu Meme</a>}
    </div> : 
    <></>
  );
};


export default Meme;