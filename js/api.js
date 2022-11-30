const ADDRESS_GET_DATA = 'https://27.javascript.pages.academy/kekstagram/data';
const ADDRESS_SEND_DATA = 'https://27.javascript.pages.academy/kekstagram';
const getData = (onSuccess, onFail) => {
  fetch(ADDRESS_GET_DATA)
    .then((response) => response.json())
    .then((pictures) => {
      onSuccess(pictures);
    })
    .catch(() => {
      onFail('Не удалось отправить форму. Попробуйте обновить страницу');
    });
};

const sendData = (onSuccess, onFail, body) => {
  fetch (
    ADDRESS_SEND_DATA,
    {
      method: 'POST',
      body:body,
    },
  )
    .then((responce) => {
      if (responce.ok) {
        onSuccess();
      } else {
        onFail();
      }
    })
    .catch(() => {
      onFail();
    });

};

export {getData, sendData};
