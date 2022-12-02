import {activateScaleControl} from './scale.js';
import {resetEffects} from './effect.js';
import {showMessageError} from './message_error.js';
import {showMessageSuccess} from './message_success.js';
import {sendData} from './api.js';

const closeButton = document.querySelector('#upload-cancel');
const body = document.querySelector('body');
const modal = document.querySelector('.img-upload__overlay');
const form = document.querySelector('.img-upload__form');
const fileField = document.querySelector('#upload-file');
const hashTagsField = document.querySelector('.text__hashtags');
const commentField = document.querySelector('.text__description');
const submitButton = document.querySelector('.img-upload__submit');
const fileChooser = document.querySelector('.img-upload__input[type=file]');
const preview = document.querySelector('.img-upload__preview img');
const smallPreview = document.querySelectorAll('.effects__preview');

const MAX_HASH_TAG_NUMBER = 5;
const VALID_SYMBOLS = /^#[a-zа-яё0-9]{1,19}$/i;
const FILE_TYPES = ['jpg', 'jpeg', 'png'];
const DEFAULT_PREVIEW = 'img/upload-default-image.jpg';

const pristine = new Pristine (form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent:'img-upload__field-wrapper',
  errorTextClass:'img-upload__field-wrapper_error',
});

const focusedTextField = () => {
  commentField.focus();
};

const showModal = () => {
  modal.classList.remove('hidden');
  body.classList.add('.modal-open');
  document.addEventListener('keydown', onEscKeyDown);
  activateScaleControl();
  submitButton.addEventListener('click', focusedTextField);
};

const closeModal = () => {
  form.reset();
  resetEffects();
  pristine.reset();
  preview.src = DEFAULT_PREVIEW;
  smallPreview.forEach((value) => {
    value.style.backgroundImage = `url("${DEFAULT_PREVIEW}")`;
  });
  modal.classList.add('hidden');
  body.classList.remove('.modal-open');
  document.removeEventListener('keydown', onEscKeyDown);
};

const isValidType = (file) => {
  const fileName = file.name.toLowerCase();
  return FILE_TYPES.some((it) => fileName.endsWith(it));
};

const onPreviewChange = () => {
  const file = fileChooser.files[0];

  if (file && isValidType(file)) {
    preview.src = URL.createObjectURL(file);
    smallPreview.forEach((value) => {
      value.style.backgroundImage = `url("${URL.createObjectURL(file)}")`;
    });
  }
};
const isTextFieldFocused = () =>
  document.activeElement === hashTagsField ||
document.activeElement === commentField;

function onEscKeyDown (evt) {
  if (evt.key === 'Escape' && !isTextFieldFocused()) {
    evt.preventDefault();
    closeModal();
  }
}

const isvalidTag = (tag) => VALID_SYMBOLS.test(tag);

const hasValidCount = (tags) => tags.length <= MAX_HASH_TAG_NUMBER;

const hasUniqueTags = (tags) => {
  const lowerCaseTags = tags.map((tag) => tag.toLowerCase());
  return lowerCaseTags.length === new Set(lowerCaseTags).size;
};

const validatedTags = (value) => {
  const tags = value
    .trim()
    .split(' ')
    .filter((tag) => tag.trim().length);
  return hasValidCount(tags) && hasUniqueTags(tags) && tags.every(isvalidTag);
};
pristine.addValidator(
  hashTagsField,
  validatedTags,
  'Неправильно заполнены хэштеги'
);
closeButton.addEventListener('click', closeModal);
fileField.addEventListener('change', showModal);
fileChooser.addEventListener('change', onPreviewChange);

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Сохраняю...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const setUserFormSubmit = () =>{
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValid = pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(
        () => {closeModal();
          unblockSubmitButton();
          showMessageSuccess();
        },
        () => {showMessageError();
          unblockSubmitButton();
        },
        new FormData(evt.target),
      );
    }
  });
};
export {closeModal, setUserFormSubmit};
