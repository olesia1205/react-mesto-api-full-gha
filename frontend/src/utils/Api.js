class Api {
  constructor(config) {
    this._url = config.baseUrl;
    this._headers = config.headers;
  }

  _getResponseData(response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(`Ошибка: ${response.status}`);
  }

  getUserInfo() {
    return fetch(`${this._url}users/me`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._getResponseData);
  }

  _getInitialCards() {
    return fetch(`${this._url}cards`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._getResponseData);
  }

  getAllNeededData() {
    return Promise.all([this.getUserInfo(), this._getInitialCards()]);
  }

  patchUserInfo(data) {
    return fetch(`${this._url}users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
    .then(this._getResponseData);
  }

  postNewCard(data) {
    return fetch(`${this._url}cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    })
    .then(this._getResponseData);
  }

  deleteCard(cardId) {
    return fetch(`${this._url}cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers
    })
    .then(this._getResponseData);
  }

  putLike(cardId) {
    return fetch(`${this._url}cards/${cardId}/likes`, {
      method: 'PUT',
      headers: this._headers
    })
    .then(this._getResponseData);
  }

  deleteLike(cardId) {
    return fetch(`${this._url}cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: this._headers
    })
    .then(this._getResponseData);
  }

  changeLikeCardStatus(cardId, isLiked) {
    return isLiked ? this.deleteLike(cardId) : this.putLike(cardId)
  }

  changeAvatar(avatar) {
    return fetch(`${this._url}users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatar
      })
    })
    .then(this._getResponseData);
  }

  getToken() {
    return this._headers.authorization = `Bearer ${localStorage.getItem('jwt')}`;
  }
}

const api = new Api({
  baseUrl: 'http://localhost:3000/',
  // baseUrl: 'https://api.mesto.olerastova.nomoredomains.monster/',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
