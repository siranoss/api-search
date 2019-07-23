import React, { Component } from 'react';
import {
  InstantSearch,
  SearchBox,
  Menu,
  PoweredBy,
  Highlight,
  InfiniteHits
} from 'react-instantsearch-dom';
import './App.css';
import $ from 'jquery';

const algoliasearch = require("algoliasearch");
const client = algoliasearch("LYITGBJZF1","67baaf6fb4bc87e9b148aa237251b326");
const index = client.initIndex("apis");

function getSpoil(id) {
  var divS = document.getElementById(id+"Spoiler");
  var msgS = document.getElementById(id+"SpoilerInnerMSG");
  if(divS.style.display === 'block'){
    divS.style.display = 'none';
    msgS.innerHTML = "Click for further info";
  }
  else {
    divS.style.display = 'block';
    msgS.innerHTML = "Click here to reduce";
  }
}

function updateFavor(id) {
  var divS = document.getElementById(id+"Star");
  if(divS.style.status === "used"){
   return;
  }
  else{
    divS.style.status = "used";
    divS.innerHTML = "&#9733";
    var upF = "0";
    index.getObject(id, ['favor'], (err, content) => {
      if (err) throw err;
      var upFInt = parseInt(content.favor, 10);
      upFInt += 1;
      upF = upFInt.toString(10);
      index.partialUpdateObject({
        favor: upF,
        objectID: id
      }, (err, content) => {
        if (err) throw err;
      });
    });
  }
}

function getCode(api,temp,lang,id) {
  if(document.getElementById(id).innerHTML !== ""){
    $('#'+id).text('');
    }
  else {
      var url = "/data/" + api + "/" + temp + "/" + temp + "." + lang;
      $.ajax({
            type: "GET",
            url: url,
            dataType: "text",
            error:function(msg){
                      alert( "Error on access !");
                      },
             success:function(data){
                      data.replace('<',"&lt;");
                      data.replace('>',"&rt;");
                      $('#'+id).text(data);
                      }
             });
    }
  }


function getTempPresentation(name,lang) {
  return name + "." + lang + " :";
}

function getCodeId(id,lang) {
  return id + "Code" + lang;
}

function getContent(id) {
  var $temp = $("<input>");
  $("body").append($temp);
  var content = $("#"+id).text();
  content.replace("&lt;",'<');
  content.replace("&rt;",'>');
  $temp.val(content).select();
  document.execCommand("copy");
  $temp.remove();
}

const WidjetSingle = (jList,i,id,api,temp) => {
  return (
    <div key={id+jList['lang'][i]['content']}>
      <div onClick={() => {getCode(api,temp,jList['lang'][i]['content'],getCodeId(id,jList['lang'][i]['content'])) }} className="codeLister">
        {getTempPresentation(temp,jList['lang'][i]['content'])}
      </div>
      <button onClick={() => {getContent(getCodeId(id,jList['lang'][i]['content']))}}>
        Click to copy
      </button>
      <pre>
        <code id={getCodeId(id,jList['lang'][i]['content'])}></code>
      </pre>
      <div>&nbsp;</div>
    </div>
  )
}

const WidjetContainerised = (jList,i,id,api,temp) => {
  return (
    <div key={id+jList['lang'][i]['content']}>
      <div onClick={() => {getCode(api,temp,jList['lang'][i]['content'],getCodeId(id,jList['lang'][i]['content'])) }} className="codeLister">
        {getTempPresentation(temp,jList['lang'][i]['content'])}
      </div>
      <button onClick={() => {getContent(getCodeId(id,jList['lang'][i]['content']))}}>
        Click to copy
      </button>
      <pre>
        <code id={getCodeId(id,jList['lang'][i]['content'])}></code>
      </pre>
      <pre>
        <code id={getCodeId(id,jList['lang'][i]['containername'])}></code>
      </pre>
      <div>&nbsp;</div>
    </div>
  )
}

function getCodeList(api,temp,id) {
  var inclusion = [];
  var jList = require("../src/data/" + api + "/" + temp + "List.json");
  for(var i = 0; i < jList['number']; i++) {
    if(jList['lang'][i]['container'] === 'no') {
      inclusion.push(WidjetSingle(jList,i,id,api,temp));
    }
    else {
      inclusion.push(WidjetContainerised(jList,i,id,api,temp));
    }
  }
  return inclusion;
}

const Hit = ({ hit }) => {
  return (
    <div
      key={hit.objectID}
      className="bg-white p-8 rounded shadow hover:shadow-md my-2 transition"
    >
      <h3 className="text-xl mb-3 flex flex-col sm:flex-row">
        <Highlight
          attribute="name"
          hit={hit}
          className="mr-2 text-grey-darkest font-normal"
        />
      </h3>
      <p className="text-grey-dark mb-3">
        <Highlight attribute="description" hit={hit} />
      </p>
      <p className="flex items-center">
        <svg
          className="w-3 h-3 mr-2 text-grey fill-current flex-no-shrink"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512.1 512.1"
        >
          <path d="M312.5 199.6c-6.1-6.1-12.8-11.5-20.1-16.1 -19.2-12.3-41.6-18.9-64.4-18.9 -31.7-0.1-62.1 12.5-84.5 35L34.9 308.2c-22.3 22.4-34.9 52.7-34.9 84.3 0 66 53.4 119.5 119.4 119.5 31.6 0.1 62-12.4 84.4-34.8l89.6-89.6c1.6-1.6 2.5-3.8 2.5-6.1 0-4.7-3.9-8.5-8.6-8.5h-3.4c-18.7 0.1-37.3-3.5-54.6-10.6 -3.2-1.3-6.9-0.6-9.3 1.9l-64.4 64.5c-20 20-52.4 20-72.4 0 -20-20-20-52.4 0-72.4l109-108.9c20-20 52.4-20 72.4 0 13.5 12.7 34.5 12.7 48 0 5.8-5.8 9.3-13.5 9.9-21.7C323 216.1 319.4 206.5 312.5 199.6z" />
          <path d="M477.1 35c-46.7-46.7-122.3-46.7-169 0l-89.5 89.4c-2.5 2.5-3.2 6.2-1.8 9.4 1.4 3.2 4.5 5.3 8 5.2h3.2c18.7 0 37.2 3.6 54.5 10.7 3.2 1.3 6.9 0.6 9.3-1.9l64.3-64.2c20-20 52.4-20 72.4 0 20 20 20 52.4 0 72.4l-80 80 -0.7 0.8 -28 27.8c-20 20-52.4 20-72.4 0 -13.5-12.7-34.5-12.7-48 0 -5.8 5.8-9.3 13.6-9.9 21.8 -0.6 9.8 3 19.3 9.9 26.3 9.9 9.9 21.4 18 34.1 23.9 1.8 0.9 3.6 1.5 5.4 2.3 1.8 0.8 3.7 1.4 5.5 2 1.8 0.7 3.7 1.3 5.5 1.8l5 1.4c3.4 0.9 6.8 1.5 10.3 2.1 4.2 0.6 8.5 1 12.7 1.2h6 0.5l5.1-0.6c1.9-0.1 3.8-0.5 6.1-0.5h2.9l5.9-0.9 2.7-0.5 4.9-1h0.9c21-5.3 40.1-16.1 55.4-31.4l108.6-108.6C523.7 157.3 523.7 81.7 477.1 35z" />
        </svg>
        <a
          href={hit.link}
          className="text-blue hover:text-blue-darker transition no-underline truncate"
          target="_blank"
          rel="noopener noreferrer"
        >
          {hit.link.replace('https://', '')
            .replace('http://', '')
            .replace('www.', '')}
        </a>
      </p>
      <div onClick={() => { getSpoil(hit.objectID) }} className="spoiler">
        <div id={hit.objectID+"SpoilerInnerMSG"}>
          Click for further info
        </div>
      </div>
      <div id={hit.objectID+"Spoiler"} className="spoiled">
        <div>
          {getCodeList(hit.API,hit.name,hit.objectID)}
        </div>
        <div id={hit.objectID+"Code"}></div>
      </div>
      <span id={hit.objectID+"Star"} onClick={() => { updateFavor(hit.objectID)}}>&#x2606;</span>
    </div>
  )
}


class App extends Component {
  render() {
    return (
      <div className="h-screen overflow-hidden">
        <InstantSearch
          appId="LYITGBJZF1"
          apiKey="c0d0c32d6bc8e80c30eabe69af5724d2"
          indexName="apis"
        >
          <div className="flex flex-col h-screen font-sans">
            <header className="flex bg-white w-full border-grey-light border-solid border-b flex-no-shrink">
              <div className="p-4 md:w-64 lg:w-64 xxl:w-80 items-center flex-no-shrink border-grey-light border-solid border-r hidden md:flex justify-center">
                <h1 className="text-base text-grey-darker uppercase tracking-wide">
                  MAIC Software
                </h1>
              </div>
              <div className="flex flex-grow justify-between">
                <SearchBox
                  className="h-full flex-grow"
                  autoFocus={true}
                  translations={{
                    placeholder: 'Search for a template name'
                  }}
                />
                <div className="flex items-center border-grey-light border-solid border-l px-4 flex-no-shrink">
                  <PoweredBy className="flex flex-col md:items-center sm:flex-row" />
                </div>
              </div>
            </header>
            <div className="flex flex-grow">
              <aside className="md:w-64 lg:w-64 xxl:w-80 flex-no-shrink bg-white border-grey-light border-solid border-r z-10 max-h-screen hidden md:block overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <h4 className="font-normal uppercase text-xs tracking-wide text-grey-dark p-4 border-grey-light border-solid">
                    Categories
                  </h4>
                  <Menu
                    attribute="categorie"
                    limit={8}
                    searchable={true}
                    translations={{
                      placeholder: 'Category searching'
                    }}
                  />
                  <h4 className="font-normal uppercase text-xs tracking-wide text-grey-dark px-4 pt-4 pb-1 border-grey-light border-solid border-t">
                    APIs
                  </h4>
                  <Menu
                    attribute="API"
                    limit={8}
                    searchable={true}
                    translations={{
                      placeholder: 'Search for APIs'
                    }}
                  />
                </div>
              </aside>
              <main className="bg-grey-lighter flex-grow max-h-screen overflow-hidden">
                <div className="h-full overflow-y-scroll">
                  <div className="flex px-8 py-6">
                      <InfiniteHits hitComponent={Hit} />
                  </div>
                </div>
              </main>
            </div>
            <footer className="flex flex-no-shrink justify-between flex-col sm:flex-row p-4 border-grey-light border-solid border-t text-sm text-grey-dark">
              <div className="text-center sm:text-left">
                Made by{' '}
                <a
                  href="https://twitter.com/@frontstuff_io"
                  className="text-blue hover:text-blue-darker transition no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @frontstuff_io
                </a>{' '}
                and{' '}
                <a
                  href="https://twitter.com/@cdenoix"
                  className="text-blue hover:text-blue-darker transition no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @cdenoix
                </a>{' '}
                -{' '}
                <a
                  href="https://github.com/clemfromspace/api-search"
                  className="text-blue hover:text-blue-darker transition no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </div>
              <div />
              <div className="text-center sm:text-right mt-2 sm:mt-0">
                Data from{' '}
                <a
                  href="https://api.publicapis.org/"
                  className="text-blue hover:text-blue-darker transition no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  api.publicapis.org
                </a>
              </div>
            </footer>
          </div>
        </InstantSearch>
      </div>
    );
  }
}


export default App
