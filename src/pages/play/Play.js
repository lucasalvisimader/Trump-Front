// styles
import './Play.css';

// react
import { useState, useEffect, useRef, Fragment } from 'react';

// components
import { DraggableCardPlay } from '../../components/draggable_card_play/DraggableCardPlay';
import { DroppableAreaPlay } from '../../components/droppable_area_play/DroppableAreaPlay';

// images
import backDeck from '../../assets/images/card/others/back.png';
import backSquirrelDeck from '../../assets/images/card/others/back_squirrel.png';
import cardSlot from '../../assets/images/game/slots/card_slot.png';
import cardQueue from '../../assets/images/game/slots/card_queue_slot.png';

// json
import en from '../../assets/locales/en.json';

// services
import { CardService } from '../../service/CardService';

// external
import { v4 as uuidV4 } from 'uuid';
import { DndContext } from '@dnd-kit/core';

const Play = () => {
    const [cards, setCards] = useState([]);
    const [playerCards, setPlayerCards] = useState([]);
    const [deckCards, setDeckCards] = useState([]);
    const [deckSquirrelCards, setDeckSquirrelCards] = useState([]);
    const [droppableAreas, setDroppableAreas] = useState([
        { key: 1, cards: [] },
        { key: 2, cards: [] },
        { key: 3, cards: [] },
        { key: 4, cards: [] },
        { key: 5, cards: [] },
        { key: 6, cards: [] },
        { key: 7, cards: [] },
        { key: 8, cards: [] },
        { key: 9, cards: [] },
        { key: 10, cards: [] },
        { key: 11, cards: [] },
        { key: 12, cards: [] }
    ]);
    const [isOnHoverCardSacrificing, setIsOnHoverCardSacrificing] = useState(false);
    const [clickedCard, setClickedCard] = useState({ key: '', is: false });

    const boardRef = useRef();

    const json = en.play;

    const handleDragStart = () => {
        setIsOnHoverCardSacrificing(true);
    }

    const handleDragEnd = (result) => {
        if (result.active && result.over) {
            setIsOnHoverCardSacrificing(false);
            const areaKey = parseInt(result.over.id.split("_")[1]);
            const cardKey = result.active.id;
            const card = generateCard(cardKey);

            const updatedDroppableAreas = droppableAreas.map((area) => {
                if (area.key === areaKey) {
                    if (area.cards.length === 0) {
                        area.cards.push(card);
                        const updatedPlayerCards = playerCards.filter((card) => card.key !== cardKey);
                        setPlayerCards(updatedPlayerCards);
                    }
                }
                return area;
            });

            setDroppableAreas(updatedDroppableAreas);
        }
    }

    const handleClickPlayerDeck = () => {
        const updatedPlayerCards = [...playerCards];
        const updatedDeckCards = [...deckCards];

        if (updatedDeckCards.length > 0) {
            updatedPlayerCards.push(updatedDeckCards.pop());
        }

        setPlayerCards(updatedPlayerCards);
        setDeckCards(updatedDeckCards);
    }

    const handleClickSquirrelPlayerDeck = () => {
        const updatedPlayerCards = [...playerCards];
        const updatedDeckSquirrelCards = [...deckSquirrelCards];

        if (updatedDeckSquirrelCards.length > 0) {
            updatedPlayerCards.push(updatedDeckSquirrelCards.pop());
        }

        setPlayerCards(updatedPlayerCards);
        setDeckSquirrelCards(updatedDeckSquirrelCards);
    }

    const generateCard = (cardKey) => {
        const card = searchCard(cardKey);
        if (card) {
            return (
                <DraggableCardPlay className="play_cards"
                    id={cardKey}
                    key={cardKey}
                    card={card}
                    boardRef={boardRef}
                />
            );
        }
    }

    const searchCard = (key) => {
        return playerCards.find((card) => card.key === key);
    }

    const cardsFromBelow = () => {
        return playerCards?.map((card) => {
            card.lengthCard = playerCards.length;
            card.isDisabled = true;
            return (
                <DraggableCardPlay className="play_cards"
                    key={card.key}
                    id={card.key}
                    card={card}
                    boardRef={boardRef}
                    clickedCard={clickedCard}
                    setClickedCard={setClickedCard}
                />
            );
        });
    }

    const renderDroppableArea = (rowLayer) => {
        return droppableAreas.slice(rowLayer, rowLayer + 4).map((droppableArea) => {
            const cards = droppableArea.cards.map((card) => {
                card.props.card.isDisabled = true;
                return (
                    <DraggableCardPlay className="play_cards"
                        id={card.key}
                        key={card.key}
                        card={card.props.card}
                        isOnHoverCardSacrificing={isOnHoverCardSacrificing}
                    />
                );
            });

            if (rowLayer === 8) {
                return (
                    <DroppableAreaPlay key={droppableArea.key}
                        id={`play_${droppableArea.key}_droppable`}
                        isInverted={rowLayer === 4 ? true : false}
                        enemyUpComing={rowLayer === 0 ? true : false}>
                        {cards}
                    </DroppableAreaPlay>
                );
            } else {
                return (
                    <div className={`play_enemy${rowLayer === 4 ? '_inverted' : ''}_input_card`}
                        style={{
                            background: `url(${rowLayer === 4 ? cardSlot : cardQueue})`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat"
                        }}
                        key={droppableArea.key}
                        id={`play_${droppableArea.key}_droppable`}>
                        {cards}
                    </div>
                );
            }
        });
    }

    useEffect(() => {
        const setCardsFunction = async () => {
            const cardsGross = await CardService.listFromUser()
            setCards(cardsGross);
        }
        setCardsFunction();
    }, []);

    useEffect(() => {
        if (cards.data?.length > 0) {
            cards.data[0]?.map((card) => {
                return card.key = uuidV4();
            })
            cards.data[1]?.map((card) => {
                return card.key = uuidV4();
            })
            cards.data[2]?.map((card) => {
                return card.key = uuidV4();
            })
            setPlayerCards(cards.data[0]);
            setDeckCards(cards.data[1]);
            setDeckSquirrelCards(cards.data[2]);
        }
    }, [cards]);

    return (<>
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className='play_container'>
                <div className='play_content'>
                    <div className='play_table_content'>
                        <div className='play_general_actions'>

                        </div>
                        <div className='play_board'
                            ref={boardRef}>
                            <div className='play_enemy_upcoming_cards_container'>
                                {renderDroppableArea(0)}
                            </div>
                            <div className='play_enemy_cards_container'>
                                {renderDroppableArea(4)}
                            </div>
                            <div className='play_player_cards_container'>
                                {renderDroppableArea(8)}
                            </div>
                        </div>
                    </div>
                    <div className='play_footer'>
                        <div className='play_player_cards'>
                            {cardsFromBelow().map((card, index) => (
                                <Fragment key={index}>
                                    {card}
                                </Fragment>
                            ))}
                        </div>
                        <div className='play_decks'>
                            {deckCards.length > 0 &&
                                <div className='play_deck_cards'
                                    onClick={handleClickPlayerDeck} >
                                    <img className='play_deck_cards_image'
                                        src={backDeck}
                                        alt={json.deck_image} />
                                </div>
                            }
                            {deckSquirrelCards.length > 0 &&
                                <div className='play_deck_squirrel_cards'
                                    onClick={handleClickSquirrelPlayerDeck} >
                                    <img className='play_deck_squirrel_cards_image'
                                        src={backSquirrelDeck}
                                        alt={json.deck_image_squirrel} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </DndContext>
    </>);
}

export default Play;