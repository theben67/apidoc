Creates a resource token for a user. This token allows a user to use API resquests that require authentication

**Note**: The created token expires after 2 hours of non-use

### Request:
<div class="requestContainer"> <div class="requestPost">POST</div> <div class="requestUrl">/api/v2.1/tokens</div> </div>

### Body:
| Property | Type   | Required | Default |  Description  |
| -------- | ------ | -------- | ------- | ------------- |
| login    | string |   yes    |   n/a   |   Username    |
| password | string |   yes    |   n/a   | User password |

### Responses:

<span class="success">**200**</span> - Successfull response

Type: Object

| Property | Type   |                      Description                         |
| -------- | ------ | -------------------------------------------------------- |
| token    | string |   The created token, expires after 2 hours of non-use    |

***

<span class="error">**401**</span> - Login or password incorrect

Type: string

Value: "401 - AUTHENTICATION FAILED : login or password incorrect"
