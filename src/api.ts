import type { InferType } from 'yup'
import type {
  Club,
  ClubInfo,
  Match,
  MemberCareerStats,
  MemberStats,
  OverallStats,
} from './models'
import { ROUTES } from './routes'
import type {
  ClubInfoInput,
  ClubSearchInput,
  MatchesStatsInput,
  MemberCareerStatsInput,
  MemberStatsInput,
  OverallStatsInput,
} from './schemas'
import { SCHEMAS } from './schemas'

class EAFCApiService {
  private readonly baseUrl = new URL('https://proclubs.ea.com/api/fc/')

  /**
   * Send a GET request to the EAFC API
   *
   * @param endpoint
   * @returns
   */
  private get = async <TInput extends Record<string, string>, TModel>(
    endpoint: keyof typeof ROUTES,
    input: TInput,
  ): Promise<TModel> => {
    const route = ROUTES[endpoint]
    const url = new URL(route.url, this.baseUrl)
    await route.schema.validate(input, { strict: true })
    Object.keys(input).forEach(key => {
      url.searchParams.append(key, input[key])
    })

    const response = await fetch(url.toString(), {
      headers: {
        accept: 'application/json',
        'accept-language': 'en-GB,en;q=0.9',
        'content-type': 'application/json',
        origin: 'https://www.ea.com',
        referer: 'https://www.ea.com/',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
      },
    })
    const json: TModel = await response.json()
    return json
  }

  /**
   * Search for a club by name
   * @param input
   * @returns
   */
  searchClub = async (
    input: InferType<typeof SCHEMAS.CLUB_SEARCH>,
  ): Promise<Club[]> => this.get('CLUB_SEARCH', input)

  /**
   * Get the overall stats of the club
   * @param input
   * @returns
   */
  overallStats = async (
    input: InferType<typeof SCHEMAS.OVERALL_STATS>,
  ): Promise<OverallStats[]> => this.get('OVERALL_STATS', input)

  /**
   * Get the career stats of all members of the club
   * @param input
   * @returns
   */
  memberCareerStats = async (
    input: InferType<typeof SCHEMAS.MEMBER_CAREER_STATS>,
  ): Promise<MemberCareerStats> => this.get('MEMBER_CAREER_STATS', input)

  /**
   * Get the career stats of all members of the club
   * @param input
   * @returns
   */
  memberStats = async (
    input: InferType<typeof SCHEMAS.MEMBER_STATS>,
  ): Promise<MemberStats> => this.get('MEMBER_STATS', input)

  /**
   * Get the stats of all matches of the club
   * @param input
   * @returns
   */
  matchesStats = async (
    input: InferType<typeof SCHEMAS.MATCHES_STATS>,
  ): Promise<Match[]> => this.get('MATCHES_STATS', input)

  /**
   * Gets information of a club
   * Note that you need to index the response by the `clubId`, e.g. check `examples/clubInfo`
   *
   * @param input
   * @returns
   */
  clubInfo = async (
    input: InferType<typeof SCHEMAS.CLUB_INFO>,
  ): Promise<ClubInfo> => this.get('CLUB_INFO', input)
}

export { EAFCApiService }
export type {
  Club,
  ClubInfo,
  ClubInfoInput,
  ClubSearchInput,
  Match,
  MatchesStatsInput,
  MemberCareerStats,
  MemberCareerStatsInput,
  MemberStats,
  MemberStatsInput,
  OverallStats,
  OverallStatsInput,
}
