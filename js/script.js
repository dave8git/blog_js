'use strict';
const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll('.titles a.active'); /* remove class 'active' from all article links  */
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active'); /* add class 'active' to the clicked link */
  const activeArticles = document.querySelectorAll('.posts .post.active'); /* remove class 'active' from all articles */
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  const href = clickedElement.getAttribute('href'); /* get 'href' attribute from the clicked link */
  const targetArticle = document.querySelector(href); /* find the correct article using the selector (value of 'href' attribute) */
  targetArticle.classList.add('active'); /* add class 'active' to the correct article */
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';

function generateTitleLinks(customSelector = '') {
  const titleList = document.querySelector(optTitleListSelector); /* remove contents of titleList */
  titleList.innerHTML = '';
  const articles = document.querySelectorAll(optArticleSelector + customSelector); /* for each article */
  let html = '';
  for (let article of articles) {
    const articleId = article.getAttribute('id'); /* get the article id */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML; /* find the title element */ /* get the title from the title element */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>'; /* create HTML of the link */
    html = html + linkHTML;
  }
  titleList.innerHTML = html; /* insert link into titleList */
  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function generateTags() {
  let allTags = {};
  const articles = document.querySelectorAll(optArticleSelector); /* find all articles */
  for (let article of articles) {/* START LOOP: for every article: */
    const tagsWrapper = article.querySelector(optArticleTagsSelector); /* find tags wrapper */
    let html = ''; /* make html variable with empty string */
    const articleTags = article.getAttribute('data-tags'); /* get tags from data-tags attribute */
    const articleTagsArray = articleTags.split(' '); /* split tags into array */
    for (let tag of articleTagsArray) {/* START LOOP: for each tag */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag +  '</a></li> ';/* generate HTML of the link */
      html += linkHTML; /* add generated code to html variable */
      if(!allTags[tag]){
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    } /* END LOOP: for each tag */
    tagsWrapper.innerHTML = html; /* insert HTML of all the links into the tags wrapper */
  }/* END LOOP: for every article: */
  const taglist = document.querySelector('.tags');
  //taglist.innerHTML = allTags.join(' ');
  const tagsParams = calculateTagsParams(allTags);
  let allTagsHTML = '';
  for(let tag in allTags) {
    allTagsHTML += '<li><a class="' + optCloudClassPrefix + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag + '</a></li>' + ' ';
  }
  taglist.innerHTML = allTagsHTML;
}

generateTags();

function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 9999999
  };

  for(let tag in tags) {
    //console.log(tag + ' is used ' + tags[tag]+ ' times');
    if(tags[tag] > params.max) {
      params.max = tags[tag];
    } else {
      params.min = tags[tag];
    }
  }
  console.log(params);
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  return classNumber;
}

function tagClickHandler(event){
  event.preventDefault(); /* prevent default action for this event */
  const clickedElement = this; /* make new constant named "clickedElement" and give it the value of "this" */
  const href = clickedElement.getAttribute('href'); /* make a new constant "href" and read the attribute "href" of the clicked element */
  const tag = href.replace('#tag-', ''); /* make a new constant "tag" and extract tag from the "href" constant */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');/* find all tag links with class active */
  for (let activeTag of activeTags) {/* START LOOP: for each active tag link */
    activeTag.classList.remove('active'); /* remove class active */
  }/* END LOOP: for each active tag link */
  const allTagLinks = document.querySelectorAll('a[href="' + href + '"]');/* find all tag links with "href" attribute equal to the "href" constant */
  for (let tagLink of allTagLinks) { /* START LOOP: for each found tag link */

    tagLink.classList.add('active'); /* add class active */

  }/* END LOOP: for each found tag link */

  generateTitleLinks('[data-tags~="' + tag + '"]'); /* execute function "generateTitleLinks" with article selector as argument */
}

function addClickListenersToTags(){
  const links = document.querySelectorAll('a[href^="#tag-"]'); /* find all links to tags */
  for (let link of links) { /* START LOOP: for each link */
    link.addEventListener('click', tagClickHandler);/* add tagClickHandler as event listener for that link */
  } /* END LOOP: for each link */
}

addClickListenersToTags();

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const authorsWrapper = article.querySelector('.post .post-author');
    console.log('authorsWrapper', authorsWrapper);
    let html = '';
    const author = article.getAttribute('data-author');
    html = '<a href="#author-' + author + '">by ' + author + '</a>';
    authorsWrapper.innerHTML = html;
  }
}
generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-]');
  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active');
  }
  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.add('active');
  }
  console.log('activeAuthors', activeAuthors);
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
  const links = document.querySelectorAll('a[href^="#author-"]');
  console.log(links);
  for (let link of links) {
    link.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();
