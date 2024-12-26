const { LinkModel } = require('../models');
const { Link } = require('../classes');
const { Op } = require('sequelize');

const getLinkById = async (shortenedPath) => {
  const link = await LinkModel.findOne({
    where: {
      shortenedPath,
      // expire: {
      //   [Op.gt]: new Date(),
      // },
    },
  });

  if (!link) return;

  try {
    const attributes = JSON.parse(link.attributes);
    const result = new Link({ shortenedPath: link.shortenedPath, ...attributes });
    return { shortenUrl: result.shortLink, expiredDate: link.expire, data: { ...attributes }, code: link.shortenedPath };
  } catch (e) {
    throw new Error(`Parse attributes error: ${e.message} - Data : ${link.attributes}`);
  }
};

const createLink = async ({ expire, expiredTime, data }) => {
  const newLink = new Link({ expire, expiredTime, attributes: data });

  await LinkModel.create(newLink.getData());

  console.log('New link created:', newLink.shortLink);

  return {
    shortenUrl: newLink.shortLink,
    expiredDate: newLink.getExpireISO(),
    data: newLink.attributes,
    code: newLink.shortenedPath,
  };
};

const deleteExpiredLinks = async () => {
  await LinkModel.destroy({
    where: {
      expire: {
        [Op.lt]: new Date(),
      },
    },
  });
};

module.exports = { getLinkById, createLink, deleteExpiredLinks };
