Creates a resource token for a user. This token allows a user to use API resquests that require authentication

**Note**: The created token expires after 2 hours of non-use

### Request:
{{{request("POST", "/api/v2.1/tokens")}}}

### Body:
| Property | Type   | Required | Default |  Description  |
| -------- | ------ | -------- | ------- | ------------- |
| login    | string |   yes    |   n/a   |   Username    |
| password | string |   yes    |   n/a   | User password |

### Responses:

{{{status(200)}}} - Successfull response

Type: Object

| Property | Type   |                      Description                         |
| -------- | ------ | -------------------------------------------------------- |
| token    | string |   The created token, expires after 2 hours of non-use    |

***

{{{status(401)}}} - Login or password incorrect

Type: string

Value: "401 - AUTHENTICATION FAILED : login or password incorrect"
{{{url}}}
