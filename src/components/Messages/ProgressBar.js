import React from 'react'
import { Progress } from 'semantic-ui-react'

const ProgressBar = ({ uploadPercentage, uploadState }) => (

    uploadState === 'uploading' && (
        <Progress
            className="progress__bar"
            percent={uploadPercentage}
            progress
            indicating
            size="medium"
            inverted
        />
    )


)

export default ProgressBar;