import { IMAGE_CREDITS } from '../data/imageCredits'
import { MENU_ITEMS } from '../data/menu'

const LICENSE_URLS: Record<string, string> = {
  'CC BY 2.0': 'https://creativecommons.org/licenses/by/2.0/',
  'CC BY-SA 2.0': 'https://creativecommons.org/licenses/by-sa/2.0/',
  'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
}

export function ImageCredits() {
  return (
    <details className="credits">
      <summary>Créditos das fotos</summary>
      <p className="credits__intro">
        As fotos dos pratos são ilustrativas e foram obtidas de fontes com licença Creative
        Commons. Autores e licenças:
      </p>
      <ul>
        {IMAGE_CREDITS.map((credit) => {
          const item = MENU_ITEMS.find((i) => i.id === credit.id)
          const licenseUrl = LICENSE_URLS[credit.license]
          return (
            <li key={credit.id}>
              {item ? `${item.number}. ` : ''}
              <a href={credit.source} target="_blank" rel="noopener noreferrer">
                {credit.title}
              </a>{' '}
              por {credit.author},{' '}
              {licenseUrl ? (
                <a href={licenseUrl} target="_blank" rel="noopener noreferrer">
                  {credit.license}
                </a>
              ) : (
                credit.license
              )}
            </li>
          )
        })}
      </ul>
    </details>
  )
}
