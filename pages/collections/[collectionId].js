import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useWeb3 } from '@3rdweb/hooks'
import {client } from '../../lib/sanityClient'
import { ThirdwebSDK } from '@3rdweb/sdk'
import Header from '../../components/Header'
import { CgWebsite } from 'react-icons/cg'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { HiDotsVertical } from 'react-icons/hi'
import NFTCard from '../../components/NFTCard'

const style = {
  bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
}

const Collection = () => {
  const router = useRouter()
  const { collectionId } = router.query;
  const { provider } = useWeb3()
  const [collection, setCollection] = useState({})
  const [nfts, setNfts] = useState([])
  const [listings, setListings] = useState([])

  //

  const nftModule = useMemo(() => {
    if (!provider) return

    const sdk = new ThirdwebSDK(
      provider.getSigner(),
    )
    return sdk.getNFTModule(collectionId)
  }, [provider])

  // get all NFTs in the collection
  useEffect(() => {
    if (!nftModule) return;
     (async () => {
      const nfts = await nftModule.getAll()

      setNfts(nfts)
    })()
  }, [nftModule])

  const marketPlaceModule = useMemo(() => {
    if (!provider) return

    const sdk = new ThirdwebSDK(
      provider.getSigner(),
    )
    return sdk.getMarketplaceModule(
      '0x837816a3B3a7ddc5ef91f55BbebD283BA8502b8E'
    )
  }, [provider])

  // get all listings in the collection
  useEffect(() => {
    if (!marketPlaceModule) return
    ;(async () => {
      setListings(await marketPlaceModule.getAllListings())
    })()
  }, [marketPlaceModule])

  const fetchCollectionData = async (sanityClient = client) => {
    const query = `*[_type == "marketItems" && contractAddress == "${collectionId}" ] {
      "imageUrl": profileImage.asset->url,
      "bannerImageUrl": bannerImage.asset->url,
      volumeTraded,
      createdBy,
      contractAddress,
      "creator": createdBy->userName,
      title, floorPrice,
      "allOwners": owners[]->,
      description
    }`

    const collectionData = await sanityClient.fetch(query)

    console.log(collectionData, '🔥')

    // the query returns 1 object inside of an array
    await setCollection(collectionData[0])
  }

  useEffect(() => {
    fetchCollectionData()
  }, [collectionId])

  console.log(router.query)
  console.log(router.query.collectionId)
  return (
    <div className="overflow-hidden">
      <Header />
      <div className={style.bannerImageContainer}>
        <img
          className={style.bannerImage}
          src={
            collection?.bannerImageUrl
              ? collection.bannerImageUrl
              : 'https://via.placeholder.com/200'
          }
          alt="banner"
        />
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={
              collection?.imageUrl
                ? collection.imageUrl
                : 'https://via.placeholder.com/200'
            }
            alt="profile image"
          />
        </div>
        <div className={style.endRow}>
          <div className={style.socialIconsContainer}>
            <div className={style.socialIconsWrapper}>
              <div className={style.socialIconsContent}>
                <div className={style.socialIcon}>
                  <CgWebsite />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineInstagram />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineTwitter />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <HiDotsVertical />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.title}>{collection?.title}</div>
        </div>
        <div className={style.midRow}>
          <div className={style.createdBy}>
            Created by{' '}
            <span className="text-[#2081e2]">{collection?.creator}</span>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.statsContainer}>
            <div className={style.collectionStat}>
              <div className={style.statValue}>{nfts.length}</div>
              <div className={style.statName}>items</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                {collection?.allOwners ? collection.allOwners.length : ''}
              </div>
              <div className={style.statName}>owners</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src="data:image/png;base64,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"
                  alt="eth"
                  className={style.ethLogo}
                />
                {collection?.floorPrice}
              </div>
              <div className={style.statName}>floor price</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAilBMVEX///+MjIw0NDQUFBQ5OTk8PDuPj48vLy9kZGQqKio4ODcAAABnZ2aBgYGJiYmEhIT39/fj4+MZGRkdHR3p6ena2tp7e3tEREQkJCTExMTR0dHx8fEbGxmXl5cODg5zc3OwsLBZWVmsrKyjo6O6urpOTk6dnZ3KysrV1dVdXVxISEgbGxpubm5RUVDZUcRMAAAKLklEQVR4nN2da3ubOBBGF9lAMDFOQi7kYsdN3CRt0v//9xZfQTAjzWCjEX6/tk9XZy0fjTVI/Pef47y7/g+6ztffR+kh9JzsIpEeQr9ZZRf5XHoQfeZ5Gl3Ei1vpYfSYj6wkjP9ID6O/fM2CklDdnK9ssmBDqGLpgfSV1Z6wOFPZ3E6DHaE6U9nMswPhecrmaRYcCM9TNhvAPaE6w8pmmWmERSQ9oFNno5ka4fnJZp41CONf0kM6bbaaqROqm5X0oE6aPWCN8Lxks9NMgzCQHtbpsteMTqgW19IDO1nmGUh4PrL5PHwLdUL1fS6yqQHqhKqQHtppUmmmRZhk0oM7RWqaaRGeh2zmmYEw/ic9vONT10ybUOWDl82VDtgiHL5s3jILYTKTHuJxuZ4GFsKhy2YeWAnj39KDPCYNzYCEg5ZNUzMwocqlx9k9Tc0ghMlUeqBd09IMQqgWd9JD7ZioDQgTDlU2bc1ghCpfSg+2SwDNoIQqv5IebocAmsEJhygbSDM44RBlA2nGQBj/lR4wN4/gtxAnHJxsruA5aiBUN8OSzTuoGSNhci89aE4QzRgJhyUbRDNmwvhBetj0YJoxE6r8TXrg1KCasRAORzaoZmyEQ5ENrhkboVp8SQ+eFAOfjXAYsjFoxko4CNmYNGMnVCP/ZWPSDIEweZUGsOXOOEfthGrxJI1giZmPQBiH0gjmmDVDIVSF1ycyLJohEarRszSGIRbN0AiTH2kMPDbN0AjVyF/ZWPlohP7KZmWdozRCb2XzbNUMlVAt/JSNXTNkQj9lQ9AMmVCNPqVxgFA+QTJhPJHGaYeiGTqhKj6kgZohaYZB6J9sPmgfIZ0wuZRG0vNF0gyH0DfZED9BDmGspKHqIWqGReiVbKia4RH6JBuqZpiE8YU02D5kzTAJ/ZEN/RNkEvpyYJiuGTahHweGGZphE/pxho+hGT6hD7LhaIZP6MOBYdYnyCeUlw1LM10IpWXD08ya8JJJKC2bOe8jjKLXccIklL2d4ImlmSj4CVWyGDEZRWXDAYyyC6XG42RUpmAhCh4YXjIq7tmvuOTbEY4WBePrKHc7wS1VM1F0/3vLtycsGXPGzygp2RA1U+rlIZ6MxzphyXhD/UJKHRimaWajlwNfnbBkpEpHSDYUwJ1exjAhXToisiFo5qAXAyFNOhKysWqmrhcTIU06Amf4LJrR9WImpEjHvWzMmmnqxUZIkI7z2wlMgG292Ant0nF8YNigGUgvNEKzdNxehYJqBtELkdAsHaeyQTSD6oVMaJKOy9sJwHN3JR+qFwahQToODwyDBwtNemERrgNLx5lsAM1Y9MImhKXj6iqUlmbseuETwtJxJJt5k8+uly6EkHTcHBjWNWOoXo4mBKTjQjba8V6qXroSrqNLx4Fsasd76Xo5hlCXTv9XoRwOxLD0chShLp3ez/BFnfRyJGFdOn3LZqsZtl6OJqxJp98DwxvNdNDLCQjX2Uqn19sJSs100suJCLfS6fN2gutZR72cinArnR5lM++ql9MRrqVT9HY7wdciOZbvBISjUZr2dlzh9iI/GvH4zzD91Wcb43OcCBOmN30/KPV+EwsSpqmDBxaff76lVotFeuHmccWnhyOm6hGEaeLuQNRb3nmqdiZMU6dnha7ubzpO1Y6Ei/TV9Rnou9+FO8JFOpa4+GSZdJmqXQjTdCnAt0424k9VPmGaCl4Edv2r4BY5XMJF+lf2gtNVzFw5mIRp6rJvCMtszpuqLMI0hVtqvWn1DfyXefU4Z0cYqbGf73sjvH2Fn2vh1ON0whR5iuY97XHleJxG8L/+QS4AqIRYjf0ZjnqtbT6y2TtY/D7/5KfsPWE19vNPofp93vRqFmRT2G7EepxEiNXYHy8qLHr+efE1DYIsg69zItXjBEKsxn6cxGFY9P6I26ZvMfsA/0dS6nErIVZj3/4pxmEYO7gObLOrj01Vez1uIVykE9hl0cskDMOJiwsldi3gLIO/KsvCPFXNhFiNvYrLCVrmxclPjP0tO7M5vOdlrsdNhFiNffcv2fCFiaNjpfunabLpEvxzYz2OE2I19tX0e7IFnLh6fK+6SSibwVt7hnocJcRq7GWhwl36Xiiq1B5MnEXwb5sIm6oIIVZjf/1NwgOgw58Z9Zusp7x6HH6+NP0H19iv+eQAqJxe5VZ/Ziibwovw4wSaqhBhOkJq7PwwQcNw7PYyEP1+yxmjHm8Tpil8PO0zjMNavh3fi7nSn22j1+NNQqzGvr0sJnXA2PkpvcYDmOR6vEGYFnDhMP/W+MKJ+xdDtU4eEutxjRCtsZU2QcvkAgeD2g+ZkurxpD5Bf0ANX29qbC0uF4oq7ZuvKPV4UvEp2E/By6TBFyqhm7GAR6Ht9XhymKBL8G+ukuYELRcKqePO4JXIWD0+203VZMdnqbG1vIhdMwge5LbU48lmgj4gNXZ7gq4XCsH3P8O3yxvr8QSvsd8KBfCFE8lXX2CH1Q31eEKpsfU5KnpcHT6XEBjqcUqNrS8Uy14JrEHv/cDqcXiF0GpsfaGQvtUMfufRdqoG1E2VRo2tJRG/4PvOcNISqccbKWvsZglTJffgIiXTaVmsyKlnDq4Qu8RevE4XfyFJgNfj+7Rr7HomfrxJwHIiGKnHNwFqbC0vnrzB03JNOT5VM9MEXVvGm/uEbVdFZTOosIRqbH2Oit7bosWwZOynaqsev/uNlDBVCvGFoor9OqxGPX51b5mgoYs+GifwqwAbU7Va2pAaW0vs2QsDrYBBVY8/PVgnqKM+Gie0u2rW9fjza2GdoKGrPhon1jdb7KbqB1pja/FnoahCu48nuqB8gO76aJzY396xIbwkEbrro3FCunOIRiizPWoP5dUBJELl7fvXTkTouI/GifGdcnRC/xaKKivrV5FAmHhxtS4W65JhJxToo3Five3TTph7uVBUQTdQqYS+LhRVbO/OsxC6feCiW44iHHv1QgQk5iXDQuj6gYtuMV6ebCaU7KNxYtpANRJOnFw/c4KYlgwjoWwfjRPDkmEilO6jcYJvoBoIxftonOAbqAbC2KPtUXvQnhtO6EMfjROs54YS+tFH4wRZMjBCT/ponCAbqBihL300TuANVIQwGcAbx9sBlwyYUHnwspUOAZcMmFD+gYtugXpuIGHuVR+NE6DnBhH61kfjhPQZetdH46S9ZACEQ1woqrSWjDahj300TpobqC1CL/tonDR7bi1CP/tonDR6bk1Cvx646BZ9A7VB6G8fjRMDocd9NE60DVSd0Oc+Gif1nptG6Orgcv+pLRl1Qs/7aJzUNlDrhMNfKKpUG6g1Qv/7aJwcloyKcAh9NE5ahIPoo3Gy30A9EL4Moo/Gya7ntid0f3C5/0R1wsH00TjZLhk7QomDy/1ns2RsCYfUR+NkvYG6IZQ6uNx71huoa8LxsPponJRLxpowFzu43H+WWUkYO32BmutEwaWSPLjcf25nl6OzXCiqPP4bZB+NE+f7v/8D2r0D2iDVf/AAAAAASUVORK5CYII="
                  alt="eth"
                  className={style.ethLogo}
                />
                {collection?.volumeTraded}.5K
              </div>
              <div className={style.statName}>volume traded</div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.description}>{collection?.description}</div>
        </div>
      </div>
      <div className="flex flex-wrap ">
        {nfts.map((nftItem, id) => (
          <NFTCard
            key={id}
            nftItem={nftItem}
            title={collection?.title}
            listings={listings}
          />
        ))}
      </div>
    </div>
  )
}

export default Collection

