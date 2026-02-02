module.exports = {
  ConvertTitleToSlug: function (title) {
    let result = title.toLowerCase().trim();
    result = result.replaceAll(' ', '-');
    return result;
  }
}
