import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
const app: Application = express();
import cookieParser from 'cookie-parser';
import router from './app/routes';
import path from 'path';
import helmet from 'helmet';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set security headers using helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Needed for many React setups
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "https://www.google-analytics.com",
          "https://stats.g.doubleclick.net",
        ],
        connectSrc: [
          "'self'",
          "https://www.google-analytics.com",
          "https://cashooz-server.vercel.app", //Replace with your API if different
        ],
        frameSrc: [
          "'self'",
          "https://www.youtube.com", // If you embed videos
          "https://www.google.com",
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xContentTypeOptions: true,
    frameguard: { action: 'sameorigin' },
  })
);


// Serve static files from "public" directory cach controll
app.use(
  express.static(path.join(__dirname, '../public'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.xml') || filePath.endsWith('.txt')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else {
        // Cache static files for 30 days
        res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
      }
    },
  })
);
// use when cors issue face
const allowedOrigin = [
  'http://localhost:3000',
  'http://194.163.173.117',
  'http://localhost:5173',

];

const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    if (!origin) {
      // Allow requests without an origin (e.g., Postman or server-side)
      return callback(null, true);
    }

    // Normalize origin by removing 'www.' for comparison
    const normalizedOrigin = origin.replace(/^www\./, '');
    const isAllowed = allowedOrigin.some(
      (allowed) =>
        allowed === normalizedOrigin || allowed === `https://www.${normalizedOrigin}`
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Enable CORS with the specified options
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.send('App is Running');
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
