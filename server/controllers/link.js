const { linkService } = require('../services');

const getLinkById = async (req, res) => {
  const { id } = req.params;
  try {
    const link = await linkService.getLinkById(id);
    if (!link) return res.status(400).send({ success: false, message: 'Could not find any link or link expired!' });
    return res.send({
      success: true,
      error: '',
      shortenUrl: link.shortenUrl,
      expiredDate: link.expiredDate,
      code: link.code,
      data: link.data,
    });
  } catch (e) {
    console.log(`Get link by id ${id} failed:`, e.message);
    console.log(e.stack);
    return res.status(400).send({ success: false, error: 'Can not get data from link!' });
  }
};

const createLink = async (req, res) => {
  try {
    const link = await linkService.createLink(req.body || {});

    return res.send({
      success: true,
      error: '',
      shortenUrl: link.shortenUrl,
      expiredDate: link.expiredDate,
      code: link.code,
      data: link.data,
    });
  } catch (e) {
    console.error('Create new link error:', (e.errors && e.errors[0].message) || e.message);
    console.error(e.stack);

    return res.status(400).send({ success: false, error: `Couldn't create link!` });
  }
};

const deleteExpiredLinks = async (req, res) => {
  try {
    await linkService.deleteExpiredLinks();

    return res.send({ success: true, error: '' });
  } catch (e) {
    console.error('Delete expired links error:', e.message);
    console.error(e.errors);
    return res.status(500).send({ success: false, error: 'Delete expired link failed!' });
  }
};

module.exports = { getLinkById, createLink, deleteExpiredLinks };
