import axios from "axios";

export const submitFormData = async (formData) => {
  try {
    const response = await axios.post('API URL', formData);
    return response.data;
  } catch (error) {
    throw new Error(`Error submitting data: ${error.message}`);
  }
};


// imageUtils.js
export const embedTextOnImage = (backgroundImageUrl, textData, markers) => {
  console.log('textData - - - ', textData);
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
        const { top, left, type } = marker;
        console.log('marker - - - ', marker);

        if (type === 'logo' && textData[type]) {
          // If type is 'logo' and a logo URL is present, load the logo image
          const logoImage = new Image();
          logoImage.crossOrigin = 'anonymous';
          logoImage.src = textData[type];

          const logoPromise = new Promise((logoResolve, logoReject) => {
            logoImage.onload = () => {
              // Adjust the size and position as needed
              const logoX = left + 350;  // Adjust the position as needed
              const logoY = top + 10;   // Adjust the position as needed
              const logoWidth = 80;
              const logoHeight = 80;
              context.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
              logoResolve();
            };

            logoImage.onerror = (error) => {
              logoReject(error);
            };
          });

          logoPromises.push(logoPromise);
        } else {
          // For text markers or other types, treat it as text
          const text = textData[type] || '';
          console.log('text - - ', text);
          context.font = '30px Arial';
          context.fillStyle = 'black';

          // Adjust the position of the text as needed
          const textX = left + 350;
          const textY = top + 250 ;  // Adjust the position as needed  // Adjust the marginBottom as needed
          context.fillText(text, textX, textY);
        }
      }

      // After all logo images are loaded, resolve with the embedded image
      Promise.all(logoPromises)
        .then(() => {
          const embeddedImage = canvas.toDataURL();
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
