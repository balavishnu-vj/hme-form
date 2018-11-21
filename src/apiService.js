/*
  TODO: Use actions or middleware to handle this
*/
export const getCategoryList = () => {
    const categoryList = new Promise((resolve, reject) => {
        const categoryListStr = localStorage.getItem('categoryList');
        if (categoryListStr) {
            resolve(JSON.parse(categoryListStr));
        } else {
            fetch('http://www.mocky.io/v2/5b6555f53300001000f6a9d3')
            .then((response) =>response.json())
            .then((parsedJSON) => {
                localStorage.setItem('categoryList', JSON.stringify(parsedJSON));
                resolve(parsedJSON);
            })
            .catch((error) => reject(error));
        }
    });
    return categoryList;
}