import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isMobile } from "react-device-detect";
import classNames from 'classnames';

import { routes } from 'constants/routes';
import { Button, Drawer } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { TMenuItem } from './types';

import styles from './menu.module.scss';

const Menu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { pathname } = useLocation();

    const menuItems: TMenuItem[] = [
        {
            id: 0,
            display: 'Home',
            hasDropdown: false,
            route: routes.HOME
        },
        {
            id: 1,
            display: 'Lista',
            hasDropdown: false,
            route: routes.SHOPPING_LIST
        },
        {
            id: 2,
            display: 'Compras',
            hasDropdown: true,
            route: routes.PURCHASE_HISTORY,
            dropdownOptions: [
                {
                    display: 'Nova Compra',
                    path: routes.NEW_PURCHASE
                },
                {
                    display: 'Histórico',
                    path: routes.PURCHASE_HISTORY
                }
            ]
        },
        {
            id: 3,
            display: 'Lugares',
            hasDropdown: true,
            route: routes.PLACES_LIST,
            dropdownOptions: [
                {
                    display: 'Lista de Lugares',
                    path: routes.PLACES_LIST
                },
                {
                    display: 'Categorias',
                    path: routes.PLACES_CATEGORIES
                }
            ]
        },
        {
            id: 4,
            display: 'Produtos',
            hasDropdown: true,
            route: routes.PRODUCTS_LIST,
            dropdownOptions: [
                {
                    display: 'Lista de Produtos',
                    path: routes.PRODUCTS_LIST
                },
                {
                    display: 'Categorias',
                    path: routes.PRODUCTS_CATEGORIES
                }
            ]

        },
        {
            id: 5,
            display: 'Marcas',
            hasDropdown: false,
            route: routes.BRANDS
        }
    ];

    const renderMobileButton = (item: TMenuItem) => {
        const buttonClass = classNames(
            [styles.button], {
            [styles['button__selected']]: pathname === item.route
        });

        if (!item.hasDropdown) {
            return (
                <Link to={item.route}>
                    <div className={buttonClass} onClick={() => setIsMenuOpen(false)}>
                        {item.display}
                    </div>
                </Link>
            )
        }

        return (
            <div className={`${buttonClass} ${styles.submenu}`}>
                {item.display}
                {item.dropdownOptions && item.dropdownOptions.map((option) => (
                    <Link to={option.path} onClick={() => setIsMenuOpen(false)}>
                        <p>{option.display}</p>
                    </Link>
                ))}
            </div>
        )
    };

    const renderButton = (item: TMenuItem) => {
        const buttonClass = classNames(
            [styles['button--regular']], {
            [styles['button__selected']]: pathname === item.route
        });

        if (!item.hasDropdown) {
            return (
                <div className={buttonClass} onClick={() => setIsMenuOpen(false)}>
                    {item.display}
                </div>
            )
        }

        const dropdownClass = classNames(
            styles.dropdown, {
            [styles['dropdown__selected']]: pathname.includes(item.route)
        });

        return (
            <div className={dropdownClass}>
                {item.display}
                {item.dropdownOptions
                    && <div className={styles['dropdown--hovered']}>
                        {item.dropdownOptions.map((option) => (
                            <Link to={option.path}><p>{option.display}</p></Link>
                        ))}
                    </div>
                }
            </div>
        )
    };

    if (isMobile) {
        return (
            <>
                <div className={styles['container--mobile']}>
                    <div className={styles.button} onClick={() => setIsMenuOpen(true)}>
                        <Button
                            classes={{ root: 'of-white' }}
                            startIcon={<MenuIcon />}
                        >
                            Menu
                        </Button>
                    </div>
                </div>
                <Drawer anchor='left' open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                    <div className={styles['drawer-container']}>
                        {menuItems.map((item) => renderMobileButton(item))}
                    </div>
                </Drawer>
            </>
        );
    }

    return (
        <div className={styles['container--regular']}>
            <div className={styles['buttons-container']}>
                {menuItems.map((item) => <Link to={item.route}>{renderButton(item)}</Link>)}
            </div>
        </div>
    );
};

export default Menu;