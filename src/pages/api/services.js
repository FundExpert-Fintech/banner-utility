import axios from 'axios';

export const getImages = async (formData) => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get('http://marketing-module-be.fundexpert.in/template/getTemplates', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: formData
    });

    if (response.data.message === 'Success') {
      return response.data;
    } else {
      throw new Error(`Server responded with an error: ${response.data.error.join(', ')}`);
    }
  } catch (error) {
    throw new Error(`Error submitting data: ${error.message}`);
  }
};
export const submitFormData = async (formData) => {
  try {
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    const token = localStorage.getItem('auth_token');
    const response = await axios.post('http://marketing-module-be.fundexpert.in/template/upload', formDataToSend, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(`Error submitting data: ${error.message}`);
  }
};


// imageUtils.js
export const embedTextOnImage = (backgroundImageUrl, textData, markers) => {
  console.log('textData - - - ', JSON.stringify(markers));
  return new Promise((resolve, reject) => {
    const backgroundImage = new Image();

    backgroundImage.crossOrigin = 'anonymous';
    backgroundImage.src = backgroundImageUrl;
    backgroundImage.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = backgroundImage.width;
      canvas.height = backgroundImage.height;
      console.log('canvas - - - ', canvas);
      context.drawImage(backgroundImage, 0, 0);
      let logoPromises = [];
      for (const marker of markers) {
        const { x, y, type, width, color } = marker;
        console.log('marker - - - ', marker);
        if (type === 'logo' && textData[type]) {
          const logoImage = new Image();
          logoImage.crossOrigin = 'anonymous';
          logoImage.src = textData[type];

          const logoPromise = new Promise((logoResolve, logoReject) => {
            logoImage.onload = () => {
              const logoX = x;
              const logoY = y;
              const logoWidth =  80;
              const logoHeight =  80;
              context.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
              logoResolve();
            };

            logoImage.onerror = (error) => {
              logoReject(error);
            };
          });

          logoPromises.push(logoPromise);
        } else if (type === 'text' && textData[type]) {
          const text = textData[type] || '';
          console.log('text - - ', text);
          context.font = '30px Arial';
          context.fillStyle = color || 'black';

          const textX = x;
          const textY = y;
          context.fillText(text, textX, textY);
        } else if (type === 'header' && textData[type]) {
          const text = textData[type] || '';
          console.log('header text - - ', text);
          context.font = '30px Arial';
          context.fillStyle = color || 'black';

          const textX = x;
          const textY = y;
          context.fillText(text, textX, textY);
        }
      }

      Promise.all(logoPromises)
        .then(() => {
          const embeddedImage = canvas.toDataURL('image/png');
          resolve(embeddedImage);
        })
        .catch((error) => {
          reject(error);
        });
    };

    backgroundImage.onerror = (error) => {
      reject(error);
    };
  });
};
