import Gallery from '@/components/ui/gallery'
import ItemData from '@/data/imageList'
import React from 'react'

const Portfolio = () => {
    const itemdata = ItemData.slice(0, 8);
    return (
        <div className="px-6 py-12 md:px-12 lg:py-24">
            <Gallery itemData={itemdata} cols={3} gap={15} />
        </div>
    )
}

export default Portfolio
