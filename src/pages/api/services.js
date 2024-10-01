import axios from 'axios';

export const getImages = async (formData) => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get('https://marketing-module-be.fundexpert.in/template/getTemplates', {
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
    const response = await axios.post('https://marketing-module-be.fundexpert.in/template/upload', formDataToSend, {
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
  return new Promise((resolve, reject) => {
    const backgroundImage = new Image();

    backgroundImage.crossOrigin = 'anonymous';
    backgroundImage.src = backgroundImageUrl;
    backgroundImage.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = backgroundImage.width;
      canvas.height = backgroundImage.height;
      context.drawImage(backgroundImage, 0, 0);
      let logoPromises = [];
      for (const marker of markers) {
        const { x, y, type, color, isBold, isItalic, isUnderline, size, font } = marker;
        context.font = `${isBold ? 'bold' : 'normal'} ${isItalic ? 'italic' : 'normal'} ${size}px ${font || 'Inter'}`;
        context.fillStyle = color || 'black';
        if (type === 'logo' && textData[type]) {
          const logoImage = new Image();
          logoImage.crossOrigin = 'anonymous';
          logoImage.src = textData[type];

          const logoPromise = new Promise((logoResolve, logoReject) => {
            logoImage.onload = () => {
              const logoWidth = logoImage.width;
              const logoHeight = logoImage.height;

              let maxLogoWidth, maxLogoHeight;
              if (logoWidth > logoHeight) {
                maxLogoWidth = 150;
                maxLogoHeight = 80;
              } else {
                maxLogoWidth = 100;
                maxLogoHeight = 120;
              }
              const scaleFactor = Math.min(maxLogoWidth / logoWidth, maxLogoHeight / logoHeight, 1);

              const newLogoWidth = logoWidth * scaleFactor;
              const newLogoHeight = logoHeight * scaleFactor;

              const offsetX = x;
              const offsetY = y;

              context.drawImage(logoImage, offsetX, offsetY, newLogoWidth, newLogoHeight);
              logoResolve();
            };

            logoImage.onerror = (error) => {
              logoReject(error);
            };
          });

          logoPromises.push(logoPromise);
        } else if ((type === 'text' || type === 'header') && textData[type]) {
          const text = textData[type] || '';
          console.log(`${type} text - - `, text);
          const textX = x;
          const textY = y;
          context.fillText(text, textX, textY);
          if (isUnderline) {
            const textWidth = context.measureText(text).width;
            const underlineY = textY + 5; // Adjust this value to position the underline as needed
            context.beginPath();
            context.moveTo(textX, underlineY);
            context.lineTo(textX + textWidth, underlineY);
            context.strokeStyle = color || 'black'; // Use the same color as the text
            context.lineWidth = 2; // Adjust underline thickness as needed
            context.stroke();
          }
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
