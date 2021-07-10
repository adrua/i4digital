import dotenv from "dotenv";
import express from "express";
import fetch from "cross-fetch";
import path from "path";

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;
const dataUrl = process.env.DATA_URL;

const app = express();

const logs: any[] = [];

// Configure Express to use EJS
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    // render the index template
    res.render( "index" );
} );

app.get( `/api/:table/all`, async ( req: any, res ) => {
    const _req: Request = req;
    logs.push({
        "id": logs.length + 1,
        "url": _req.url,
        "date": new Date(),
        "method":  _req.method
    });

    try {
        const _table = req.params.table;
        let result = null;

        switch(_table.toLowerCase()) {
            case 'logs':
                result = logs;
                break;
            default:
                result = await fetch(`${dataUrl}/${ _table }`)
                    .then((response: Response) => response.json());
                break;
        }

        return res.json( result );
    } catch ( err ) {
        // tslint:disable-next-line:no-console
        console.error(err);
        res.json( { error: err.message || err } );
    }
} );

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );