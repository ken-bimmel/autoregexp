import { React, useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Card, CardContent } from '@material-ui/core';

function ReplaceBox(props) {
  const [findRegExp, setFindRegExp] = useState(props.config.find);
  const [replaceValue, setReplaceValue] = useState(props.config.replace);

  function handleNewFindRegExp(event) {
    console.log(event, event.target.value);
    setFindRegExp(event.target.value)
  }

  function handleNewReplaceValue(event) {
    setReplaceValue(event.target.value)
  }

  useEffect(() => {
    if (findRegExp && replaceValue) {
      props.changeCallback({ find: findRegExp, replace: replaceValue })
    }
  }, [findRegExp, replaceValue])

  return (
    <Grid item>
      <Card>
        <CardContent>
          <Grid container direction="column">
            <Grid item>
              <TextField
                label="Find RegExp"
                value={findRegExp}
                helperText="Must use JS regexp syntax"
                onChange={handleNewFindRegExp}
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Replace value"
                value={replaceValue}
                helperText="Must use JS regexp syntax"
                onChange={handleNewReplaceValue}
                style={{ width: "100%" }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default ReplaceBox;
