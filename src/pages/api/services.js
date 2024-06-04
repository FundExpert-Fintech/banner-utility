import axios from 'axios';

export const getImages = async (formData) => {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwicm9sZUlkIjoyLCJyb290VXNlciI6IlZpc2lvbiIsIm5hbWUiOiJTb3VyYWJoIEJhamFqIiwiZW1haWwiOiJlZXNoYW5zaHVrbGEyNTk4QGdtYWlsLmNvbSIsIm1vYmlsZU51bWJlciI6bnVsbCwiaWF0IjoxNzE3NDk0Nzc3LCJleHAiOjE3MTc1ODExNzd9.9EdNt-bsq_FmmmvARQP5ROVfNvMJqPUV2-KSKekvZo4';
    const response = await axios.get('http://localhost:8000/template/getTemplates', {
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

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwicm9sZUlkIjoyLCJyb290VXNlciI6IlZpc2lvbiIsIm5hbWUiOiJTb3VyYWJoIEJhamFqIiwiZW1haWwiOiJlZXNoYW5zaHVrbGEyNTk4QGdtYWlsLmNvbSIsIm1vYmlsZU51bWJlciI6bnVsbCwiaWF0IjoxNzE3NDk0Nzc3LCJleHAiOjE3MTc1ODExNzd9.9EdNt-bsq_FmmmvARQP5ROVfNvMJqPUV2-KSKekvZo4';

    const response = await axios.post('http://localhost:8000/template/upload', formDataToSend, {
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
  console.log('textData - - - ', backgroundImageUrl);
  return new Promise((resolve, reject) => {
    const backgroundImage = new Image();

    backgroundImage.crossOrigin = 'anonymous';
    backgroundImage.src = backgroundImageUrl;
    console.log(backgroundImage.onload)
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
          const logoImage = new Image();
          logoImage.crossOrigin = 'anonymous';
          logoImage.src = textData[type];

          const logoPromise = new Promise((logoResolve, logoReject) => {
            logoImage.onload = () => {
              const logoX = left;
              const logoY = top;
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
          const text = textData[type] || '';
          console.log('text - - ', text);
          context.font = '30px Arial';
          context.fillStyle = 'black';

          const textX = left;
          const textY = top;
          context.fillText(text, textX, textY);
        }
      }

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
