import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Using a simpler regex to extract the value within double quotes
  const match = err.message.match(/"([^"]*)"/);

  // The extracted value is in match[1]
  const extractedMessage = match ? match[1] : null;

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMessage} is already exixts`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid Error',
    errorSources,
  };
};

export default handleDuplicateError;
