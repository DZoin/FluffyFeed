define({ "api": [  {    "type": "get",    "url": "/api/kitten/:pagesize?/:index?",    "title": "Request kitten feed",    "name": "GetKitten",    "group": "Kitten",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "int",            "optional": false,            "field": "Pagesize",            "description": "<p>[Optional]The number of items inside the response. Default value 5</p>"          },          {            "group": "Parameter",            "type": "string",            "optional": false,            "field": "Index",            "description": "<p>[Optional]The index of the last viewed item. Passing this parameter fetches the next page of the feed.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Array",            "optional": false,            "field": "kittens",            "description": "<p>Array of Kitten objects</p>"          },          {            "group": "Success 200",            "type": "int",            "optional": false,            "field": "pageSize",            "description": "<p>Current pagination size</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "index",            "description": "<p>[Optional]Index of last item. If not present end of feed has been reached</p>"          }        ]      },      "examples": [        {          "title": "Sample response",          "content": "{\n  \"kittens\": [\n      {\n          \"_id\": \"597c2c02f9ec57078e333e5a\",\n          \"name\": \"MrFluff\",\n          \"__v\": 0\n      },\n      {\n          \"_id\": \"597c3448d5e87d1845e02dea\",\n          \"name\": \"Roshko\",\n          \"__v\": 0\n      }\n  ],\n  \"pageSize\": 2,\n  \"index\": \"597d75cc67e0f246367ca827\"\n  }",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "./Kittens/kittenRouter.js",    "groupTitle": "Kitten"  },  {    "type": "post",    "url": "/api/kitten",    "title": "Create a kitten profile",    "name": "PostKitten",    "group": "Kitten",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "string",            "optional": false,            "field": "Name",            "description": "<p>The name of the kitten. Must be passed as x-www-form-urlencoded</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./Kittens/kittenRouter.js",    "groupTitle": "Kitten"  },  {    "type": "delete",    "url": "/token/:token",    "title": "Blacklist a token",    "name": "DeleteToken",    "group": "Token",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "string",            "optional": false,            "field": "token",            "description": "<p>The token to invalidate</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "message",            "description": "<p>A success message</p>"          }        ]      },      "examples": [        {          "title": "Sample response",          "content": "{\n\"message\":\"Session successfully invalidated!\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "./Token/tokenRouter.js",    "groupTitle": "Token"  },  {    "type": "get",    "url": "/token",    "title": "Get a JWT",    "name": "GetToken",    "group": "Token",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "token",            "description": "<p>The JWT</p>"          }        ]      },      "examples": [        {          "title": "Sample response",          "content": "{\n  \"success\": true,\n  \"message\": \"Token issued successfully!\",\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4NGFkOWU0LTlkMjAtNGY0YS05YmU5LWMwYThkYjIwZWRiYiIsImlhdCI6MTUwMTM5OTg5MiwiZXhwIjoxNTAxNDAxMzMyfQ.TKxEG4taUb2_CR9CeNO6Ht0uLniUSNog2tqQOMhr2Rc\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "./Token/tokenRouter.js",    "groupTitle": "Token"  },  {    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "optional": false,            "field": "varname1",            "description": "<p>No type.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "varname2",            "description": "<p>With type.</p>"          }        ]      }    },    "type": "",    "url": "",    "version": "0.0.0",    "filename": "./doc/main.js",    "group": "_Users_dimitarzoin_Work_FluffyFeed_doc_main_js",    "groupTitle": "_Users_dimitarzoin_Work_FluffyFeed_doc_main_js",    "name": ""  }] });
