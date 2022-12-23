import React from "react";

const VideoEmbed = ({ embedId, width, height, title }) => {

    return (
        <div>
            <iframe
                width={width}
                height={height}
                src={`https://www.youtube.com/embed/${embedId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={title}
            />
        </div>
    )
}

export default VideoEmbed;