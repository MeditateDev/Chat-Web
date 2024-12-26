const { PUBLIC_DOMAIN, LINK_EXPIRE_MINUTES, VIRTUAL_PATH, CODE_LENGTH } = process.env;

module.exports = class Link {
  constructor({ shortenedPath, attributes, expire, expiredTime }) {
    this.shortenedPath = shortenedPath || this.getRandomString(CODE_LENGTH || 5);
    this.attributes = attributes || {};
    this.canExpire = expire;
    this.expiredTime = expiredTime;
    this.expire = this.getExpireTime();
    this.shortLink = PUBLIC_DOMAIN + VIRTUAL_PATH + '/' + this.shortenedPath;
  }

  getData() {
    return {
      shortenedPath: this.shortenedPath,
      attributes: JSON.stringify(this.attributes),
      expire: this.expire,
    };
  }

  getRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }

  isExpired() {
    return this.expire <= Date.now();
  }

  getExpireTime() {
    const currentDate = new Date();

    //if not not expire => set 500 years later
    if (!this.canExpire) return currentDate.setFullYear(currentDate.getFullYear() + 500);

    //if expire and expire time
    if (this.expiredTime) return new Date(this.expiredTime);

    // else get default after minutes
    return currentDate.setMinutes(currentDate.getMinutes() + ((LINK_EXPIRE_MINUTES && parseInt(LINK_EXPIRE_MINUTES)) || 30));
  }

  getExpireISO() {
    return new Date(this.expire).toISOString().split('.')[0] + '.000Z';
  }
};
