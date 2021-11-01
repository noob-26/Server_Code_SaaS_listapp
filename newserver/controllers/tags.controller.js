const Snippet_Model = require('../models/Snippet');

const getAllTags = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    var allTagsaArr = [];
    Snippet_Model.find({}, {tag: 1})
      .then((data) => {
        data.map((d) => {
          var newTag = d.tag;
          newTag.map((t) => {
            allTagsaArr.push({t});
          });
        });
        res.status(200).json(allTagsaArr);
      })
      .catch((err) => res.status(400).json(`Error: ${err}`));
}

const getAllTagTemplates = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    var allTagsaArr = [];
    Template_Model.find({}, {tag: 1})
      .then((data) => {
        data.map((d) => {
          var newTag = d.tag;
          newTag.map((t) => {
            allTagsaArr.push({t});
          });
        });
        res.status(200).json(allTagsaArr);
      })
      .catch((err) => res.status(400).json(`Error: ${err}`));
}

const addTagtoSnippet = async (req, res) => {
  const { tag, selected, type } = req.body;

  const promiseArray = selected.map(async (each) => {
    return new Promise(async (resolve, reject) => {
      const template = await Snippet_Model.find({ _id: each });
      await template[0].tag.push(tag);
      await Snippet_Model.findByIdAndUpdate(each, template[0], {
        new: true,
        useFindAndModify: false,
      });
      return resolve();
    });
  });
  Promise.all(promiseArray).then(async () => {
    try {
      const allTemplates = await Snippet_Model.find({ type: type });
      res.status(201).json(allTemplates);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  });
}


module.exports = {
    getAllTagTemplates,
    getAllTags,
    addTagtoSnippet
}
