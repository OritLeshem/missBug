import { bugService } from '../services/bug.service.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/bug-list.jsx'
import { BugFilter } from '../cmps/bug-filter.jsx'

const { useState, useEffect } = React

export function BugIndex() {

    const [bugs, setBugs] = useState([])
    // const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [filterBy, setFilterBy] = useState()

    // const [sortDate, setSortDate] = useState(false)
    // const [sortBy, setSortBy] = useState(bugService.getDefaultSort())
    const [sortBy, setSortBy] = useState()

    useEffect(() => {
        loadBugs()
    }, [filterBy, sortBy])

    function loadBugs() {
        bugService.query(filterBy, sortBy)
            .then((bugs) => {
                setBugs(bugs)

            })
    }

    // function onSort() {
    //     console.log('sort by date')
    //     setFilterBy(prev => ({ ...prev, date: !prev.date }))
    //     setSortDate(prev => !prev)
    //     console.log(filterBy)

    // }
    function onSetFilter(filterBy) {
        setFilterBy(filterBy)
    }
    function onSetSort(sortBy) {
        console.log('setSortBy', sortBy)
        setSortBy(sortBy)
    }
    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
        }
        bugService.save(bug)
            .then(savedBug => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService.save(bugToSave)
            .then(savedBug => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map(currBug => (currBug._id === savedBug._id) ? savedBug : currBug)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    return (
        <main>
            <h3>Bugs App</h3>
            <main>
                <BugFilter onSetFilter={onSetFilter} onSetSort={onSetSort} />
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <div>hellp</div>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )


}
