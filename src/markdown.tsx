import * as React from "react";

import * as marked from 'marked';
// import { marked } from 'marked'; // has no exported member 'marked'.


// import Axios from 'axios';
// const response = await Axios.get('/api/user');
// console.log("axios========================>", response);

// function getAxios(config: any): any {
//   const context = new Axios(config);
//   const axios = Axios.prototype.request.bind(context);

//   extend(axios, context);

//   return axios;
// }

// const axios = getAxios({});

// axios.create = function(config: any) {
//   return getAxios(config);
// };

// const http = axios.create({
//     xsrfCookieName: 'xsrf-token'
// });
// console.log("http========================>", http);

function xhr(config:any): XMLHttpRequest {
    const { data = null, url, method = 'get', done } = config
    const req:any = new XMLHttpRequest()
    // console.log('UNSENT', xhr.readyState); // readyState 为 0
    req.open(method.toUpperCase(), url, true);
    // console.log('OPENED', req.readyState); // readyState 为 1

    req.onprogress = function () {
        // console.log('LOADING', req.readyState); // readyState 为 3
    };
    req.onload = function () {
        if (done) done(req);
        // console.log('DONE', req.readyState); // readyState 为 4
    };
    req.send(data);
    return req;
}
// xhr({url:"./src/demo.md", done: (req: XMLHttpRequest) =>{
//     console.log("===============================>", req)
// }});


var rendererMD = new marked.Renderer();
    marked.setOptions({
        renderer: rendererMD,
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
    });

var demo = marked('I am using __markdown__.')

interface ItState {
    counter: number;    
}

export class Markdown extends React.Component<{}, ItState>
{
    source: String = `
## MarkdownPreview

> todo: React component preview markdown text.
    `;

    private post: string

    constructor () {
        super();
        this.state = { counter: 0 };
        this.post = marked(this.source);
    }

    private handleClick(ev: React.MouseEvent<HTMLButtonElement>)
    {
        var event= document.createEvent("Event");
        event.initEvent("markdownload", false, true);
        window.dispatchEvent(event);

        xhr({url:"./src/demo.md", done: (req: XMLHttpRequest) =>{
            this.post = req.responseText;
            this.setState({counter:  1 + this.state.counter});
        }});

        // http.get("./src/demo.md").then((res: any)=>{
        //     console.log("demo.md", res);
        //     this.post = res.responseText;
        // }).catch((err: any) => {
        //     console.log("demo.md", err);
        // });
    }


    render()
    {
        return (
            <div className="hello">
                <div dangerouslySetInnerHTML={{__html: marked(this.post) }} />
                <button onClick={e => this.handleClick(e)}>Load demo.md</button>
            </div>
        ) ;
    }
}

/*
https://github.com/markedjs/marked
https://uiwjs.github.io/react-markdown-preview/
https://gitee.com/uiw/react-markdown-editor
https://www.npmjs.com/package/react-markdown
https://dev.to/ashwamegh/creating-a-markdown-editor-in-react-js-typescript-with-deployment-through-github-actions-hfn
*/