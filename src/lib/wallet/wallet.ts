import { GoogleAuth, JWTInput } from "google-auth-library";
import JWT from "jsonwebtoken";

// TODO: Define Issuer ID
const issuerId = process.env.ISSUER_ID ?? '';

const classId = process.env.CLASS_ID ? `${issuerId}.${process.env.CLASS_ID}`: ``;

const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';

const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? '{}';
const credentials: JWTInput = JSON.parse(credentialsJson);

const httpClient = new GoogleAuth({
  credentials: credentials,
  scopes: 'https://www.googleapis.com/auth/wallet_object.issuer'
});
let passEnsured = false

export const ensurePassClass = async function () {
  if (passEnsured) return;

  let genericClass = {
    "id": `${classId}`,
    "classTemplateInfo": {
      "cardTemplateOverride": {
        "cardRowTemplateInfos": [
          {
            "threeItems": {
              "startItem": {
                "firstValue": {
                  "fields": [
                    {
                      "fieldPath": "object.textModulesData['average']"
                    }
                  ]
                }
              },
              "middleItem": {
                "firstValue": {
                  "fields": [
                    {
                      "fieldPath": "object.textModulesData['type']"
                    }
                  ]
                }
              },
              "endItem": {
                "firstValue": {
                  "fields": [
                    {
                      "fieldPath": "object.textModulesData['rounds_used']"
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    }
  }

  let response;
  try {
    // Check if the class exists already
    response = await httpClient.request({
      url: `${baseUrl}/genericClass/${classId}`,
      method: 'GET'
    });
    passEnsured = true;
    console.log('Class already exists');
    console.log(response);
  } catch (err) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as any).response === 'object' &&
      (err as any).response !== null &&
      'status' in (err as any).response &&
      (err as any).response.status === 404
    ) {
      // Class does not exist
      // Create it now
      response = await httpClient.request({
        url: `${baseUrl}/genericClass`,
        method: 'POST',
        data: genericClass
      });
      passEnsured = true;
      console.log('Class insert response');
      console.log(response);
    } else {
      // Something else went wrong
      console.error(err);
      throw err;
    }
  }
}

export const createPassUrl = async function (userId: string, email: string, club:string, logo: string, displayName: string, memberType: string, roundsPurchased: number, averageScore: number, colour: string = '#f49943') {
  // TODO: Create a new Generic pass for the user
  let objectSuffix = `${(email + club).replace(/[^\w.-]/g, '_')}`;
  let objectId = `${issuerId}.${objectSuffix}`;
  await ensurePassClass();
  let genericObject =
  {
    "id": `${objectId}`,
    "classId": `${classId}`,
    "logo": {
      "sourceUri": {
        "uri": logo//"http://prestonpansrifleclub.co.uk/wp-content/uploads/2023/01/Club-Badge-2.jpg"
      },
      "contentDescription": {
        "defaultValue": {
          "language": "en-US",
          "value": "LOGO_IMAGE_DESCRIPTION"
        }
      }
    },
    "cardTitle": {
      "defaultValue": {
        "language": "en-US",
        "value": "Prestonpans Rifle Club"
      }
    },
    "subheader": {
      "defaultValue": {
        "language": "en-US",
        "value": "Name"
      }
    },
    "header": {
      "defaultValue": {
        "language": "en-US",
        "value": displayName
      }
    },
    "textModulesData": [
      {
        "id": "average",
        "header": "Average",
        "body": averageScore
      },
      {
        "id": "type",
        "header": "Type",
        "body": memberType
      },
      {
        "id": "rounds_used",
        "header": "Rounds Used",
        "body": roundsPurchased
      }
    ],
    "barcode": {
      "type": "QR_CODE",
      "value": userId,
      "alternateText": ""
    },
    "hexBackgroundColor": colour
  }

  const claims = {
    iss: credentials.client_email,
    aud: 'google',
    origins: [],
    typ: 'savetowallet',
    payload: {
      genericObjects: [
        genericObject
      ]
    }
  };

  const token = JWT.sign(claims, credentials.private_key ?? '', { algorithm: 'RS256' });
  const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

  return saveUrl;
}