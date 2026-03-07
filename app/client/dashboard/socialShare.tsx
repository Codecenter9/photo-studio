
import React from 'react'
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    TelegramIcon,
    TelegramShareButton,
    ThreadsIcon,
    ThreadsShareButton,
    TwitterIcon,
    TwitterShareButton,
    ViberIcon,
    ViberShareButton,
    WhatsappIcon,
    WhatsappShareButton,
} from "react-share";
interface SocialSharePropes {
    url: string;
    userName?: string;
}
const SocialShare = ({ url, userName }: SocialSharePropes) => {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-4 flex-wrap">
            <div className="w-full flex items-center justify-between gap-2">
                <TelegramShareButton title={`Visit this site to access ${userName}`} url={url} >
                    <TelegramIcon size={32} round />
                </TelegramShareButton>
                <FacebookShareButton title={`Visit this site to access ${userName}`} url={url} >
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <LinkedinShareButton title={`Visit this site to access ${userName}`} url={url} >
                    <LinkedinIcon size={32} round />
                </LinkedinShareButton>
                <TwitterShareButton title={`Visit this site to access ${userName}`} url={url} >
                    <TwitterIcon size={32} round />
                </TwitterShareButton>
            </div>
            <div className="w-full flex items-center justify-between gap-2">
                <WhatsappShareButton title={`Visit this site to access ${userName}`} url={url} >
                    <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <EmailShareButton title={`Visit this site to access ${userName}`} url={url} >
                    <EmailIcon size={32} round />
                </EmailShareButton>
                <ThreadsShareButton title={`Visit this site to access ${userName}`} url={url} >
                    <ThreadsIcon size={32} round />
                </ThreadsShareButton>
                <ViberShareButton title={`Visit this site to access ${userName}`} url={url} >
                    <ViberIcon size={32} round />
                </ViberShareButton>
            </div>
        </div>
    )
}

export default SocialShare
