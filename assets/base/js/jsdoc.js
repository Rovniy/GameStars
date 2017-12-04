/**
 * @typedef {object} ServerError
 * @property {number} code
 * @property {string} type
 * @property {string | *} message
 */
/**
 * @template T
 * @typedef {object} ServerResult<T>
 * @property {T} data
 * @property {string} method
 * @property {number} status
 */

/**
 * @typedef {object} Tournament
 * @property {number} id
 * @property {number} award_count
 * @property {number} award_fund
 * @property {TournamentAward[]} award_list
 * @property {string} award_type
 * @property {number} backgroundPictureId
 * @property {BlindCalendar[]} blind_calendar
 * @property {number} blind_countdown
 * @property {Object.<string, string>} conditions
 * @property {number} coverPictureId
 * @property {GameRegion} game_region
 * @property {number} reg_countdown
 * @property {number} start_countdown
 * @property {TournamentStats} stats
 * @property {TournamentInfo} tournament_info
 * @property {TournamentWar[]} tournamentWars
 */
/**
 * @typedef {object} GameRegion
 * @property {number} id
 * @property {string} gameType
 * @property {string} regionId
 * @property {string} regionName
 */
/**
 * @typedef {object} UserTournamentStatus
 * @property {string} buyInUserStatus
 * @property {number} currentPrize
 * @property {number} ladder
 * @property {number} matchCount
 * @property {string} name
 * @property {string} rank
 * @property {UserRebuyStatus} rebuy
 * @property {UserRebuyStatus} addon
 * @property {number} stackCount
 * @property {string} status
 */
/**
 * @typedef {object} UserRebuyStatus
 * @property {boolean} active
 * @property {number} amount
 * @property {boolean} available
 * @property {number} cost
 * @property {number} duration
 * @property {number} endDate
 * @property {number} endCountdown
 * @property {number} fromMinutes
 * @property {number} quantity
 * @property {string} rebuyCurrency
 * @property {string} rebuyType
 * @property {number} stackLimit
 * @property {number} startCountDown
 * @property {number} startDate
 */
/**
 * @typedef {object} TournamentBuyIn
 * @property {number} id
 * @property {string} currencyType
 * @property {boolean} isDefault
 * @property {number} stack
 * @property {number} value
 */
/**
 * @typedef {object} TournamentAward
 * @property {number} award
 * @property {number} fromPos
 * @property {number} toPos
 */
/**
 * @typedef {object} BlindCalendar
 * @property {boolean} active
 * @property {number} endDate
 * @property {number} max
 * @property {number} min
 * @property {number} startDate
 * @property {string} text
 */
/**
 * @typedef {object} TournamentStats
 * @property {number} active_members
 * @property {number} avg_stack
 * @property {number} match_count
 * @property {number} max_stack
 * @property {number} min_stack
 * @property {number} out_members
 */
/**
 * @typedef {object} TournamentInfo
 * @property {string} award_computing
 * @property {number} blind_max
 * @property {number} blind_min
 * @property {TournamentBuyIn[]} buy_in
 * @property {string} class
 * @property {number} end_date
 * @property {string} name
 * @property {number} reg_start_date
 * @property {number} start_date
 * @property {number} start_member_count
 * @property {string} status
 * @property {string[]} tags
 * @property {string} time_zone
 */
/**
 * @typedef {object} TournamentWar
 * @property {string} id
 * @property {TournamentWarCommand[]} commands
 */
/**
 * @typedef {object} TournamentWarCommand
 * @property {string} id
 * @property {*} general
 * @property {string} name
 * @property {string} utm
 * @property {number} sum
 * @property {number} playersCount
 */

/**
 * @typedef {Object} FriendsResponse
 * @property {FriendModel[]} friends
 * @property {string} my_current_text_status
 */
/**
 * @typedef {Object} FriendModel
 * @property {number} avatarId
 * @property {string} direction
 * @property {number} level
 * @property {string} name
 * @property {string} relation
 * @property {string} userId
 */

/**
 * @typedef {object} UserProfile
 * @property {number} level
 * @property {number} nextLevelExp
 * @property {{isGameAccountLinked: boolean}} options
 * @property {GameAccount[]} gameAccounts
 * @property {UserData} userData
 * @property {string[]} linkedAccounts
 */
/**
 * @typedef {object} UserData
 * @property {boolean} active
 * @property {number} avatarId
 * @property {number} createTime
 * @property {UserCurrency[]} currencyList
 * @property {string} email
 * @property {boolean} emailValidated
 * @property {number} experience
 * @property {string} id
 * @property {string} ip
 * @property {string} lang
 * @property {number} lastLogin
 * @property {string} name
 * @property {[string]} providers
 * @property {string} referralUser
 * @property {string} role
 * @property {string} status
 * @property {string} tz
 */
/**
 * @typedef {object} GameAccount
 * @property {number} id
 * @property {number} level
 * @property {string} name
 * @property {string} rank
 * @property {GameRegion} gameRegion
 */
/**
 * @typedef {object} GameRegion
 * @property {number} id
 * @property {string} regionId
 * @property {string} regionName
 * @property {string} gameType
 */
/**
 * @typedef {object} UserCurrency
 * @property {number} count
 * @property {number} bonus
 * @property {number} updateTime
 * @property {{tournamentId: number, type: string}} id
 */
/**
 * @typedef {object} UserCurrencyUpdateData
 * @property {{ main: number, bonus: number }} count
 * @property {string} currencyType
 * @property {number} tournamentId
 */

/**
 * @typedef {object} StarpointShopItem
 * @property {number} totalCost
 * @property {number} starpoints
 * @property {number} bonusPercent
 * @property {number} code
 */
/**
 * @typedef {object} PaymentData
 * @property paymentMethod
 * @property purchaseType
 * @property value
 * @property [firstName]
 * @property [lastName]
 * @property [cardNo]
 * @property [cardExpireYear]
 * @property [cardExpireMonth]
 * @property [cardSecurityCode]
 */
/**
 * @typedef {object} ConversionData
 * @property {string} srcCurrency
 * @property {string} destCurrency
 * @property {number} value
 */

/**
 * @typedef {object} ReferralData
 * @property {string} referral_url
 * @property {Referrer[]} referrers
 * @property {ReferralBonus} referral_bonus
 */
/**
 * @typedef {object} Referrer
 * @property {string} name
 * @property {number} matchCount
 * @property {boolean} used
 */
/**
 * @typedef {object} ReferralBonus
 * @property {number} all
 * @property {number} bonus
 * @property {number} potential
 */

/**
 * @typedef {object} ApplicationInterval
 * @property {string} applicationId
 * @property {number} startTime
 */

/**
 * @typedef {object} socketService
 * @property {function} webSocketInit
 * @property {function} sendMessage
 * @property {function} removeHandler
 * @property {function} addHandler
 * @property {function} close
 * @property {function} isOpened
 * @property {function} isWebSocketSupported
 */

/**
 * @typedef {object} Analytics
 * @property {trackEvent} trackEvent
 * @property {identify} identify
 */
/**
 * @callback trackEvent
 * @param {string} category
 * @param {string} action
 * @param {string} label
 * @param {object} params
 */
/**
 * @callback identify
 * @param {*} [id]
 * @param {*} [name]
 * @param {*} [lname]
 */